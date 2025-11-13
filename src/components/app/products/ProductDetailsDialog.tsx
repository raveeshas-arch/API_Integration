import { Details } from "../../common/Details"
import { Product } from "../../../types/Product"

interface ProductDetailsDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const productSections = [
  {
    title: "Product Information",
    fields: [
      { label: "Title", key: "title" },
      { label: "Description", key: "description", span: 2 },
      { label: "Price", key: "price", prefix: "$" },
      { label: "Stock", key: "stock", suffix: " items" },
    ]
  },
  {
    title: "Brand & Category",
    fields: [
      { label: "Brand", key: "brand", badge: true },
      { label: "Category", key: "category", badge: true, variant: "outline" },
    ]
  },
  {
    title: "Rating",
    fields: [
      { label: "Rating", key: "rating",  },
    ]
  }
]

export function ProductDetailsDialog({ product, open, onOpenChange }: ProductDetailsDialogProps) {
  return (
    <Details
      data={product}
      open={open}
      onOpenChange={onOpenChange}
      title={product?.title || "Product Details"}
      description="Complete product information"
      sections={productSections}
      imageKey="thumbnail"
    />
  )
}