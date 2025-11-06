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

  const handleDeleteUser = (userId: number) => {
    deleteUser(userId)
    toast.success(MESSAGES.USER_DELETED)
  }

  const handleViewUser = (user: ManualUser) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
  }

  const handleUpdateUser = (updatedUser: ManualUser) => {
    updateUser(updatedUser)
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
