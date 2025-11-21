"use client"
import { ColumnDef } from "@tanstack/react-table"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DataTableColumnHeader } from "../data-table-column-header"
import { Checkbox } from "../ui/checkbox"
import { Product } from "../../types/Product" // <-- CHANGE HERE
import { ViewProduct } from "./ViewProduct"   // <-- CHANGE HERE
import { EditProduct } from "./EditProduct"   // <-- CHANGE HERE
import { DeleteAlert } from "./DeleteProduct" // <-- CHANGE HERE
import { useAuth } from "../../hooks/useAuth"

// Table Titles / Keys
const columnDefinitions = [
  { key: "image", title: "Image" },
  { key: "productName", title: "Product Name" },
  { key: "category", title: "Category" },
  { key: "price", title: "Price" },
  { key: "stock", title: "Stock" },
  { key: "status", title: "Status" },
  { key: "rating", title: "Rating" },
] as const

interface ProductColumnsProps {
  onDeleteProduct?: (productId: number) => void
  onViewProduct?: (product: Product) => void
  onUpdateProduct?: (product: Product) => void
}

export const createProductColumns = (
  props?: ProductColumnsProps
): ColumnDef<Product>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },

  // Image column with custom cell
  {
    accessorKey: "image",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      const product = row.original
      return product.image ? (
        <img 
          src={product.image} 
          alt={product.productName}
          className="w-12 h-12 object-cover rounded"
        />
      ) : (
        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs">
          No Image
        </div>
      )
    },
  },

  // Auto-generate other columns
  ...columnDefinitions.slice(1).map(({ key, title }) => ({
    accessorKey: key,
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
  })),

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original
      const { isAdmin } = useAuth()

      return (
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <ViewProduct product={product} onViewProduct={props?.onViewProduct} />

            {isAdmin && (
              <>
                <EditProduct product={product} onUpdateProduct={props?.onUpdateProduct} />
                <DeleteAlert product={product} onDeleteProduct={props?.onDeleteProduct} />
              </>
            )}
          </div>
        </TooltipProvider>
      )
    },
  },
]
