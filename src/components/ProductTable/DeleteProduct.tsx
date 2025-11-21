import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Product } from "../../types/Product"
import toast from "react-hot-toast"
import { API_ENDPOINTS } from "../../config/api"

interface DeleteProductProps {
  product: Product
  onDeleteProduct?: (productId: number) => void
}

export function DeleteAlert({ product, onDeleteProduct }: DeleteProductProps) {
  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${product._id || product.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      const result = await response.json()

      if (response.ok) {
        onDeleteProduct?.(product.id)
        toast.success(result.message || "Product deleted successfully!")
      } else {
        toast.error(result.error || "Failed to delete product")
      }
    } catch (error) {
      toast.error("Error deleting product")
      console.error("Error:", error)
    }
  }

  return (
    <Tooltip>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              <span className="font-semibold"> "{product.productName}"</span> from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TooltipContent>
        <p>Delete</p>
      </TooltipContent>
    </Tooltip>
  )
}