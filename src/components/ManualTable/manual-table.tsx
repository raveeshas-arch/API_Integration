import { useState } from "react"
import { DataTable } from "../customUi/data-table"
import { createManualColumns } from "./manual-columns"
import { ManualUser } from "../../types/ManualUser"
import Form from "./Form"
import { UserDetailsDialog } from "./UserDetailsDialog"
import toast from 'react-hot-toast'
import { useManualUserStore } from '../../stores/manualUserStore'
import { MESSAGES } from '../../constants'

const ManualTable = () => {
  const { users: manualUsers, addUser, deleteUser, updateUser } = useManualUserStore()
  const [selectedUser, setSelectedUser] = useState<ManualUser | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const handleAddUser = (user: ManualUser) => {
    addUser(user)
  }

  const handleDeleteUser = async (userId: number) => {
  try {
    const user = manualUsers.find(u => u.id === userId)
    if (!user) return

    if (!user.dbId) {
      
      deleteUser(userId)
      toast.success(MESSAGES.USER_DELETED)
      return
    }

    // Delete from database using MongoDB ID
    const response = await fetch(`http://localhost:5000/api/users/${user.dbId}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      deleteUser(userId)
      toast.success(MESSAGES.USER_DELETED)
    } else {
      toast.error('Failed to delete user from database')
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    toast.error('Error deleting user')
  }
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
