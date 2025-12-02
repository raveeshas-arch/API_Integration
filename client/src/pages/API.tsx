import { DataTable } from "../components/customUi/data-table";
import { createProductColumns } from "@/components/app/products/columns";
import { ProductDetailsDialog } from "@/components/app/products/ProductDetailsDialog";
import { BackendPagination } from "@/components/ui/backend-pagination";
import { fetchProductsList } from "@/apis/user";
import { useState, useEffect } from "react";
import { Product } from "@/types/Product";
import { MESSAGES } from "@/constants";
import { LoaderOne } from "@/components/ui/loader";

const API = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);

  const loadProducts = async (page = 1, pageLimit = limit) => {
    setIsLoading(true);
    try {
      const data = await fetchProductsList();
      const startIndex = (page - 1) * pageLimit;
      const endIndex = startIndex + pageLimit;
      const paginatedProducts = data.slice(startIndex, endIndex);
      
      setProducts(paginatedProducts);
      setTotalProducts(data.length);
      setTotalPages(Math.ceil(data.length / pageLimit));
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setViewDialogOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">API Products</h1>
      
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <LoaderOne />
        </div>
      )}
      
      {error && <div className="text-red-500 mt-4">{MESSAGES.ERROR}: {error}</div>}
      
      {!isLoading && !error && products.length > 0 && (
        <>
          <DataTable 
            columns={createProductColumns({ onViewProduct: handleViewProduct })} 
            data={products} 
          />
          
          <BackendPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalProducts}
            pageSize={limit}
            onPageChange={(page) => loadProducts(page)}
            onPageSizeChange={(size) => {
              setLimit(size)
              loadProducts(1, size)
            }}
          />
        </>
      )}
      
      <ProductDetailsDialog 
        product={selectedProduct}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </div>
  );
};

export default API;