import { DataTable } from "../components/customUi/data-table";
import { createProductColumns } from "@/components/app/products/columns";
import { ProductDetailsDialog } from "@/components/app/products/ProductDetailsDialog";
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

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsList();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
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
        <DataTable 
          columns={createProductColumns({ onViewProduct: handleViewProduct })} 
          data={products} 
        />
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