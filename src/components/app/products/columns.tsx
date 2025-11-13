"use client"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "../../data-table-column-header"
import { Checkbox } from "../../ui/checkbox"
import { Button } from "../../ui/button"
import { Eye } from "lucide-react"
import { Product } from "../../../types/Product"

const columnDefinitions = [
  { key: "title", title: "Title" },
  { key: "price", title: "Price" },
  { key: "brand", title: "Brand" },
  { key: "category", title: "Category" },
  { key: "rating", title: "Rating" },
  { key: "stock", title: "Stock" },
] as const

interface ProductColumnsProps {
  onViewProduct?: (product: Product) => void
}

export const createProductColumns = (props?: ProductColumnsProps): ColumnDef<Product>[] => [
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
  {
    accessorKey: "thumbnail",
    header: "Image",
    cell: ({ row }) => (
      <img 
        src={row.original.thumbnail} 
        alt={row.original.title}
        className="w-8 h-8 object-cover rounded border"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://via.placeholder.com/32x32?text=No+Image';
        }}
      />
    ),
  },
  ...columnDefinitions.map(({ key, title }) => ({
    accessorKey: key,
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }: any) => {
      const value = row.getValue(key)
      if (key === "price") return `$${value}`
      if (key === "rating") return (
        <div className="flex items-center gap-1">
          <span>{value}</span>
        </div>
      )
      return value
    },
  })),
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => props?.onViewProduct?.(product)}
          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 dark:text-blue-300"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    },
  },
]