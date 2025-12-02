import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface BackendPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function BackendPagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  pageSize, 
  onPageChange, 
  onPageSizeChange 
}: BackendPaginationProps) {
  // Safety checks for NaN values
  const safePage = currentPage || 1
  const safeTotal = totalItems || 0
  const safeSize = pageSize || 10
  const safeTotalPages = totalPages || 1
  
  const startItem = safeTotal > 0 ? (safePage - 1) * safeSize + 1 : 0
  const endItem = Math.min(safePage * safeSize, safeTotal)
  
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {safeTotal} items
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-5">
          <p className="text-sm font-medium">Rows per page</p>
          <select
            value={safeSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 w-[70px] rounded border border-input bg-background px-2 py-1 text-sm dark:bg-gray-800"
          >
            {[10, 20, 30, 50, 100].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {safePage} of {safeTotalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(1)}
            disabled={safePage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(safePage - 1)}
            disabled={safePage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(safePage + 1)}
            disabled={safePage === safeTotalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(safeTotalPages)}
            disabled={safePage === safeTotalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}