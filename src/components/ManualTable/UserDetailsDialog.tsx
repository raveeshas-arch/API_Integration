import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separetor"
import { ManualUser } from "../../types/ManualUser"

interface UserDetailsDialogProps {
  user: ManualUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailsDialog({ user, open, onOpenChange }: UserDetailsDialogProps) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user.fullName}</DialogTitle>
          <DialogDescription>
            Complete user information and details
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500">Full Name</span>
                <p className="text-sm font-medium">{user.fullName}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Age</span>
                <p className="text-sm font-medium">{user.age} years</p>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-gray-500">Birth Date</span>
                <p className="text-sm font-medium">{user.birthDate || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500">Email Address</span>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Phone Number</span>
                <p className="text-sm font-medium">{user.phone}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Education Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500">School/Institution</span>
                <p className="text-sm font-medium">{user.school}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Course</span>
                <div className="mt-1">
                  <Badge variant="outline" className="capitalize">
                    {user.course}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">System Information</h3>
            <div>
              <span className="text-xs text-gray-500">User ID</span>
              <p className="text-sm font-medium font-mono">{user.id}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}