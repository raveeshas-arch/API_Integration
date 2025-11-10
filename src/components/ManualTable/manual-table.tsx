import { useState } from "react"
import { DataTable } from "../customUi/data-table"
import { createManualColumns } from "./manual-columns"
import { ManualUser } from "../../types/ManualUser"
import Form from "./Form"
import { UserDetailsDialog } from "./UserDetailsDialog"
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
import toast from 'react-hot-toast'
import { useManualUserStore } from '../../stores/manualUserStore'
import { MESSAGES } from '../../constants'

const ManualTable = () => {
  const { users: manualUsers, addUser, deleteUser, updateUser, clearAll } = useManualUserStore()
  const [selectedUser, setSelectedUser] = useState<ManualUser | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const handleAddUser = (user: ManualUser) => {
    addUser(user)
  }

  const handleDeleteUser = (userId: number) => {
    deleteUser(userId)
  }

  const handleDeleteAll = () => {
    clearAll()
    toast.success('All users deleted successfully')
  }

  const handleViewUser = (user: ManualUser) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
  }

  const handleUpdateUser = async (updatedUser: ManualUser) => {
    try {
      if (!updatedUser.dbId) {
        // If no dbId, just update locally
        updateUser(updatedUser)
        return
      }

      // Update in database using MongoDB ID
      const response = await fetch(`http://localhost:5000/api/users/${updatedUser.dbId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: updatedUser.fullName,
          age: updatedUser.age,
          email: updatedUser.email,
          phone: updatedUser.phone,
          gender: updatedUser.gender,
          birthDate: updatedUser.birthDate,
          course: updatedUser.course
        })
      })

      if (response.ok) {
        updateUser(updatedUser)
        toast.success('User updated successfully')
      } else {
        toast.error('Failed to update user in database')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Error updating user')
    }
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
                  className="bg-red-600 hover:bg-red-700"
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
      <UserDetailsDialog 
        user={selectedUser}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </div>
  )
}

export default ManualTable