import { DataTable } from "../components/customUi/data-table";
import { createProductColumns } from "@/components/app/products/columns";
import { ProductDetailsDialog } from "@/components/app/products/ProductDetailsDialog";
import { fetchProductsList } from "@/apis/user";
import { useState, useEffect } from "react";
import { Product } from "@/types/Product";
import { MESSAGES } from "@/constants";
import { LoaderOne } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

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
          
          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing {products.length} of {totalProducts} products
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-5">
                <p className="text-sm font-medium">Rows per page</p>
                <select
                  value={limit}
                  onChange={(e) => {
                    const newLimit = Number(e.target.value)
                    setLimit(newLimit)
                    loadProducts(1, newLimit)
                  }}
                  className="h-8 w-[70px] rounded border border-input bg-background px-2 py-1 text-sm dark:bg-gray-800"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => loadProducts(1)}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => loadProducts(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => loadProducts(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => loadProducts(totalPages)}
                disabled={currentPage === totalPages || isLoading}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
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