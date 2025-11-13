import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ManualUser } from "../../types/ManualUser"
import toast from 'react-hot-toast'
import { MESSAGES } from '../../constants'

interface DeleteAlertProps {
  user: ManualUser
  onDeleteUser?: (userId: number) => void
}

export function DeleteAlert({ user, onDeleteUser }: DeleteAlertProps) {
  return (
    <AlertDialog>
      <Tooltip>
        <AlertDialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
        </AlertDialogTrigger>
        <TooltipContent>
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {user.fullName}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              try {
                const response = await fetch(`http://localhost:3001/api/users/${user.dbId}`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                })

                const result = await response.json()
                
                if (response.ok) {
                  onDeleteUser?.(user.id)
                  toast.success(result.message || MESSAGES.USER_DELETED)
                } else {
                  toast.error(result.error || 'Failed to delete user')
                }
              } catch (error) {
                toast.error('Error deleting user')
                console.error('Error:', error)
              }
            }}
            className="bg-red-600 hover:bg-red-700  dark:bg-red-400"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}