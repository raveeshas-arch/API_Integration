import { useState, useEffect } from "react"
import { DataTable } from "../../components/customUi/data-table"
import { createProductColumns } from "./product-colomn"
import ProductForm from "./ProductForm"
import { Product } from "../../types/Product"
import { API_ENDPOINTS } from "../../config/api"
import toast from "react-hot-toast"

export function ProductTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS)
      const result = await response.json()
      
      if (response.ok) {
        const mappedProducts = (result.products || []).map((product: any) => ({
          ...product,
          id: product._id || product.id
        }))
        setProducts(mappedProducts)
      } else {
        toast.error("Failed to fetch products")
      }
    } catch (error) {
      toast.error("Error fetching products")
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct])
  }

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    )
  }

  const handleDeleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(product => product.id !== productId))
  }

  const handleViewProduct = (product: Product) => {
    console.log("Viewing product:", product)
  }

  const columns = createProductColumns({
    onDeleteProduct: handleDeleteProduct,
    onViewProduct: handleViewProduct,
    onUpdateProduct: handleUpdateProduct,
  })

  if (loading) {
    return <div className="flex justify-center p-8">Loading products...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <ProductForm onAddProduct={handleAddProduct} />
      </div>
      <DataTable columns={columns} data={products} />
    </div>
  )
}