import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Upload, X } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Product } from "../../types/Product"
import toast from "react-hot-toast"
import { API_ENDPOINTS } from "../../config/api"

const CATEGORIES = ["kitchen", "school", "home", "electronics"] as const
const STATUSES = ["Active", "Out of Stock"] as const

const formFields = [
  { name: "productName", label: "Product Name", type: "text" },
  { name: "image", label: "Image URL", type: "url" },
  { name: "price", label: "Price", type: "number" },
  { name: "stock", label: "Stock", type: "number" },
  { name: "rating", label: "Rating", type: "number" },
] as const

const formSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters"),
  image: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  category: z.enum(CATEGORIES),
  price: z.string().min(1, "Price is required"),
  stock: z.string().min(1, "Stock is required"),
  status: z.enum(STATUSES),
  rating: z.string().refine((val) => {
    const num = parseFloat(val)
    return num >= 0 && num <= 5
  }, "Rating must be between 0 and 5"),
})

type FormData = z.infer<typeof formSchema>

interface EditProductProps {
  product: Product
  onUpdateProduct?: (product: Product) => void
}

export function EditProduct({ product, onUpdateProduct }: EditProductProps) {
  const [open, setOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      image: "",
      category: "kitchen" as const,
      price: "",
      stock: "",
      status: "Active" as const,
      rating: "",
    },
  })

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)

    if (newOpen) {
      form.reset({
        productName: product.productName || "",
        image: product.image || "",
        category: (product.category as typeof CATEGORIES[number]) || "kitchen",
        price: (product.price || 0).toString(),
        stock: (product.stock || 0).toString(),
        status: (product.status as typeof STATUSES[number]) || "Active",
        rating: (product.rating || 0).toString(),
      })
      setImagePreview(product.image || null)
    }
  }

  const onSubmit = async (data: FormData) => {
    const updatedProduct: Product = {
      ...product,
      productName: data.productName,
      image: data.image || undefined,
      category: data.category,
      price: Number(data.price),
      stock: Number(data.stock),
      status: data.status,
      rating: Number(data.rating),
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${product._id || product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      })

      const result = await response.json()

      if (response.ok) {
        onUpdateProduct?.({...updatedProduct, _id: product._id})
        toast.success(result.message || "Product updated successfully!")
        setOpen(false)
      } else {
        toast.error(result.error || "Failed to update product")
      }
    } catch (error) {
      toast.error("Error updating product")
      console.error("Error:", error)
    }
  }

  return (
    <Tooltip>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 dark:text-green-400"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details below.</DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {formFields.filter(f => f.name !== 'image').map(({ name, label, type }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input type={type} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              
              {/* Image Upload Section */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input 
                            type="url" 
                            placeholder="Enter image URL" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              setImagePreview(e.target.value)
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('editImageUpload')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                        </div>
                        
                        <input
                          id="editImageUpload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (event) => {
                                const result = event.target?.result as string
                                field.onChange(result)
                                setImagePreview(result)
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                        
                        {imagePreview && (
                          <div className="relative inline-block">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-32 h-32 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={() => {
                                field.onChange('')
                                setImagePreview(null)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      <TooltipContent>
        <p>Edit</p>
      </TooltipContent>
    </Tooltip>
  )
}
