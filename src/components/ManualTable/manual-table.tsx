import { useState ,useEffect} from "react"
import { DataTable } from "../customUi/data-table"
import { createManualColumns } from "./manual-columns"
import { ManualUser } from "../../types/ManualUser"
import Form from "./Form"
import { UserDetailsDialog } from "./UserDetailsDialog"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
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
import toast from 'react-hot-toast'
import { useManualUserStore } from '../../stores/manualUserStore'


const ManualTable = () => {
  const { users: manualUsers, addUser, deleteUser, updateUser, clearAll, setUsers } = useManualUserStore()
  const [selectedUser, setSelectedUser] = useState<ManualUser | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
const [currentPage, setCurrentPage] = useState(1)
const [totalPages, setTotalPages] = useState(1)
const [loading, setLoading] = useState(false)
const [limit, setLimit] = useState(10)
const [totalUsers, setTotalUsers] = useState(0)


const fetchUsers = async (page = 1, pageLimit = limit) => {
  setLoading(true)
  try {
    const response = await fetch(`http://localhost:3001/api/users?page=${page}&limit=${pageLimit}`)
    const data = await response.json()
    if (data.success) {
      const mappedUsers = data.users.map((user: any) => ({
        ...user,
        id: user.id || Date.now() + Math.random(),
        dbId: user._id
      }))
      setUsers(mappedUsers)
      setTotalPages(data.pagination.totalPages)
      setCurrentPage(data.pagination.currentPage)
      setTotalUsers(data.pagination.totalUsers)
    }
  } catch (error) {
    toast.error('Failed to load users')
  } finally {
    setLoading(false)
  }
}


useEffect(() => {
  fetchUsers()
}, [])


  const handleAddUser = (user: ManualUser) => {
  fetchUsers(currentPage)
}


  const handleDeleteUser = (userId: number) => {
    deleteUser(userId)
    fetchUsers(currentPage)
  }

  const handleDeleteAll = () => {
    clearAll()
    toast.success('All users deleted successfully')
  }

  const handleViewUser = (user: ManualUser) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
  }

  const handleUpdateUser = (updatedUser: ManualUser) => {
    updateUser(updatedUser)
    fetchUsers(currentPage)
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <Form onAddUser={handleAddUser} />
        {manualUsers.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                Delete All Users
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete All Users</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete all {manualUsers.length} users? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAll}
                  className="bg-red-600 hover:bg-red-700  dark:bg-red-400"
                >
                  Delete All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <DataTable 
        columns={createManualColumns({ 
          onDeleteUser: handleDeleteUser,
          onViewUser: handleViewUser,
          onUpdateUser: handleUpdateUser
        })} 
        data={manualUsers} 
      />
      
      {/* Server-side Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {manualUsers.length} of {totalUsers} users
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-5">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              value={limit}
              onChange={(e) => {
                const newLimit = Number(e.target.value)
                setLimit(newLimit)
                fetchUsers(1, newLimit)
              }}
              className="h-8 w-[70px] rounded border border-input bg-background px-2 py-1 text-sm dark:bg-gray-800"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => fetchUsers(1)}
            disabled={currentPage === 1 || loading}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => fetchUsers(currentPage - 1)}
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
            onClick={() => fetchUsers(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => fetchUsers(totalPages)}
            disabled={currentPage === totalPages || loading}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <UserDetailsDialog 
        user={selectedUser}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </div>
  )
}

export default ManualTable