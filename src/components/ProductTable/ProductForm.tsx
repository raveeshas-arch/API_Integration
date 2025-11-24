import { useEffect,useRef } from 'react';
import { Package, Upload, X } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Product } from "../../types/Product"
import { useState } from "react"
import toast from 'react-hot-toast'
import { API_ENDPOINTS } from "../../config/api"
import CloudinaryUpload from "../CloudinaryUpload"

// Declare cloudinary on window object
declare global {
  interface Window {
    cloudinary: any;
  }
}

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

interface ProductFormProps {
  onAddProduct: (product: Product) => void
}

const ProductForm = ({ onAddProduct }: ProductFormProps) => {
  
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

  const onSubmit = async (data: FormData) => {
    const productData = {
      productName: data.productName,
      image: data.image || null,
      category: data.category,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      status: data.status,
      rating: parseFloat(data.rating),
    }

    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      })
     
      const result = await response.json()
      if (response.ok) {
        const newProduct: Product = {
          ...result.product,
          id: result.product._id
        }
        onAddProduct(newProduct);
        toast.success(result.message || "Product added successfully!");
        form.reset();
        setOpen(false);
      } else {
        toast.error(result.error || 'Failed to save product');
      }
    } catch (error) {
      toast.error('Connection error - Server not available');
      console.error('Error:', error);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="font-bold bg-gray-200 hover:bg-black hover:text-white cursor-pointer">
            <Package />
            Add New Product
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the product details below.
            </DialogDescription>
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
                      <CloudinaryUpload
                        value={field.value || ''}
                        onChange={(url) => {
                          field.onChange(url)
                          setImagePreview(url)
                        }}
                      />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Button type="submit">Add Product</Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductForm