import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Product } from "../../types/Product"

interface ViewProductProps {
  product: Product
  onViewProduct?: (product: Product) => void
}

export function ViewProduct({ product, onViewProduct }: ViewProductProps) {
  const handleView = () => {
    onViewProduct?.(product)
  }

  return (
    <Tooltip>
      <Dialog>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 dark:text-blue-400"
              onClick={handleView}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              View product information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {product.image && (
              <div className="flex justify-center">
                <img 
                  src={product.image} 
                  alt={product.productName}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Product Name</label>
                <p className="text-sm font-semibold">{product.productName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-sm">{product.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Price</label>
                <p className="text-sm">${product.price}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Stock</label>
                <p className="text-sm">{product.stock}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-sm">{product.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Rating</label>
                <p className="text-sm">{product.rating}/5</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TooltipContent>
        <p>View</p>
      </TooltipContent>
    </Tooltip>
  )
}