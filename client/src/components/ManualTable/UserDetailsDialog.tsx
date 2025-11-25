import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separetor"
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
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{user.fullName}</DialogTitle>
          <DialogDescription className="text-sm">
            Complete user information and details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 sm:mb-3">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <span className="text-xs text-gray-500">Full Name</span>
                <p className="text-sm font-medium break-words">{user.fullName}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Age</span>
                <p className="text-sm font-medium break-words">{user.age} years</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Gender</span>
                <div className="mt-1">
                  <Badge variant="secondary" className="capitalize text-xs">{user.gender}</Badge>
                </div>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs text-gray-500">Birth Date</span>
                <p className="text-sm font-medium break-words">{user.birthDate || "Not provided"}</p>
              </div>
            </div>
          </div>
          
          <Separator className="mt-4 sm:mt-6" />
          
          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 sm:mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500">Email Address</span>
                <p className="text-sm font-medium break-words">{user.email}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Phone Number</span>
                <p className="text-sm font-medium break-words">{user.phone}</p>
              </div>
            </div>
          </div>
          
          <Separator className="mt-4 sm:mt-6" />
          
          {/* Education Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 sm:mb-3">Education Details</h3>
            <div>
              <span className="text-xs text-gray-500">Course</span>
              <div className="mt-1">
                <Badge variant="outline" className="capitalize text-xs">{user.course}</Badge>
              </div>
            </div>
          </div>
          
          <Separator className="mt-4 sm:mt-6" />
          
          {/* System Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 sm:mb-3">System Information</h3>
            <div>
              <span className="text-xs text-gray-500">User ID</span>
              <p className="text-sm font-medium break-words font-mono">{user.id}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}