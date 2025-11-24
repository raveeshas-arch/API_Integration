import { useState, useEffect } from "react"
import { DataTable } from "../../components/customUi/data-table"
import { createProductColumns } from "./product-colomn"
import ProductForm from "./ProductForm"
import { Product } from "../../types/Product"
import { API_ENDPOINTS } from "../../config/api"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

export function ProductTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

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
        setAllProducts(mappedProducts)
        paginateProducts(mappedProducts, 1, limit)
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

  // Paginate products
  const paginateProducts = (productList: Product[], page: number, pageLimit: number) => {
    const startIndex = (page - 1) * pageLimit
    const endIndex = startIndex + pageLimit
    const paginatedProducts = productList.slice(startIndex, endIndex)
    
    setProducts(paginatedProducts)
    setTotalPages(Math.ceil(productList.length / pageLimit))
    setCurrentPage(page)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    paginateProducts(allProducts, page, limit)
  }

  // Handle limit change
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    paginateProducts(allProducts, 1, newLimit)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAddProduct = (newProduct: Product) => {
    const updatedProducts = [...allProducts, newProduct]
    setAllProducts(updatedProducts)
    paginateProducts(updatedProducts, currentPage, limit)
  }

  const handleUpdateProduct = (updatedProduct: Product) => {
    const updatedProducts = allProducts.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    )
    setAllProducts(updatedProducts)
    paginateProducts(updatedProducts, currentPage, limit)
  }

  const handleDeleteProduct = (productId: number) => {
    const updatedProducts = allProducts.filter(product => product.id !== productId)
    setAllProducts(updatedProducts)
    paginateProducts(updatedProducts, currentPage, limit)
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
      
      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {products.length} of {allProducts.length} products
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-5">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="h-8 w-[70px] rounded border border-input bg-background px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || loading}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || loading}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}