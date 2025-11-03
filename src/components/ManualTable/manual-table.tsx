import { useState, useEffect } from "react"
import { DataTable } from "../app/users/data-table"
import { createManualColumns } from "./manual-columns"
import { ManualUser } from "../../types/ManualUser"
import Form from "./Form"
import { UserDetailsDialog } from "./UserDetailsDialog"
import toast from 'react-hot-toast'

const ManualTable = () => {
  const [manualUsers, setManualUsers] = useState<ManualUser[]>([])
  const [selectedUser, setSelectedUser] = useState<ManualUser | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  useEffect(() => {
    const savedUsers = localStorage.getItem('manualUsers')
    if (savedUsers) {
      setManualUsers(JSON.parse(savedUsers))
    }
  }, [])

  const handleAddUser = (user: ManualUser) => {
    const updatedUsers = [user, ...manualUsers]
    setManualUsers(updatedUsers)
    localStorage.setItem('manualUsers', JSON.stringify(updatedUsers))
  }

  const handleDeleteUser = (userId: number) => {
    const updatedUsers = manualUsers.filter(user => user.id !== userId)
    setManualUsers(updatedUsers)
    localStorage.setItem('manualUsers', JSON.stringify(updatedUsers))
    toast.success(`User deleted successfully!`)
  }

  const handleViewUser = (user: ManualUser) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
  }

  const handleUpdateUser = (updatedUser: ManualUser) => {
    const updatedUsers = manualUsers.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    )
    setManualUsers(updatedUsers)
    localStorage.setItem('manualUsers', JSON.stringify(updatedUsers))
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
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
