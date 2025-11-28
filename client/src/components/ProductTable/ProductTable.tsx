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
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  // Fetch products with pagination from backend
  const fetchProducts = async (page = 1, pageLimit = limit) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_ENDPOINTS.PRODUCTS}?page=${page}&limit=${pageLimit}`)
      const result = await response.json()
      
      if (response.ok) {
        const mappedProducts = (result.products || []).map((product: any) => ({
          ...product,
          id: product._id || product.id
        }))
        setProducts(mappedProducts)
        
        // Handle pagination data
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages)
          setCurrentPage(result.pagination.currentPage)
          setTotalProducts(result.pagination.totalProducts)
        } else {
          // Fallback for non-paginated response
          setTotalPages(1)
          setCurrentPage(1)
          setTotalProducts(mappedProducts.length)
        }
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
    fetchProducts(currentPage)
  }

  const handleUpdateProduct = (updatedProduct: Product) => {
    fetchProducts(currentPage)
  }

  const handleDeleteProduct = (productId: number) => {
    fetchProducts(currentPage)
  }

  const handleViewProduct = (product: Product) => {
    console.log("Viewing product:", product)
  }

  const handlePageChange = (page: number) => {
    fetchProducts(page)
  }

  const handlePageSizeChange = (size: number) => {
    setLimit(size)
    fetchProducts(1, size)
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
      
      <DataTable 
        columns={columns} 
        data={products}
        pagination={{
          currentPage,
          totalPages,
          totalItems: totalProducts,
          pageSize: limit,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange
        }}
      />
    </div>
  )
}