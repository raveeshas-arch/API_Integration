import { DataTable } from "../components/customUi/data-table";
import { createProductColumns } from "@/components/app/products/columns";
import { ProductDetailsDialog } from "@/components/app/products/ProductDetailsDialog";
import { useProducts } from "@/hooks/useUser";
import { useState } from "react";
import { Product } from "@/types/Product";

const API = () => {
  const { data: products = [], isLoading: productsLoading, error: productsError } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  console.log('API Debug:', { products, productsLoading, productsError, productsLength: products.length });

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setViewDialogOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">API Products</h1>
      
      {productsLoading && <div>Loading products...</div>}
      {productsError && <div>Error: {productsError.message}</div>}
      {!productsLoading && !productsError && products.length > 0 && (
        <DataTable 
          columns={createProductColumns({ onViewProduct: handleViewProduct })} 
          data={products} 
        />
      )}
      {!productsLoading && !productsError && products.length === 0 && (
        <div>No products found</div>
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