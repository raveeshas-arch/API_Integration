"use client"
import { ColumnDef } from "@tanstack/react-table"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import { DataTableColumnHeader } from "../data-table-column-header"
import { Checkbox } from "../ui/checkbox"
import { ManualUser } from "../../types/ManualUser"
import { ViewUser } from "./ViewUser"
import { EditUser } from "./EditUser"
import { DeleteAlert } from "./DeleteAlert"
import { useAuth } from "../../hooks/useAuth"

const columnDefinitions = [
  { key: "fullName", title: "Full Name" },
  { key: "age", title: "Age" },
  { key: "email", title: "Email" },
  { key: "phone", title: "Phone" },
  { key: "gender", title: "Gender" },
  { key: "birthDate", title: "Birth Date" },
  { key: "course", title: "Course" },
] as const



interface ManualColumnsProps {
  onDeleteUser?: (userId: number) => void
  onViewUser?: (user: ManualUser) => void
  onUpdateUser?: (user: ManualUser) => void
}

export const createManualColumns = (props?: ManualColumnsProps): ColumnDef<ManualUser>[] => [
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
 
  
  ...columnDefinitions.map(({ key, title }) => ({
    accessorKey: key,
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
  })),
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original
      const { isAdmin } = useAuth()
 
      return (
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <ViewUser user={user} onViewUser={props?.onViewUser} />
            {isAdmin && (
              <>
                <EditUser user={user} onUpdateUser={props?.onUpdateUser} />
                <DeleteAlert user={user} onDeleteUser={props?.onDeleteUser} />
              </>
            )}
          </div>
        </TooltipProvider>
      )
    },
  },
]