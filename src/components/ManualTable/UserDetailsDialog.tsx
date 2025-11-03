import { Details } from "../common/Details"
import { ManualUser } from "../../types/ManualUser"

interface UserDetailsDialogProps {
  user: ManualUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const userSections = [
  {
    title: "Personal Information",
    fields: [
      { label: "Full Name", key: "fullName" },
      { label: "Age", key: "age", suffix: " years" },
      { label: "Gender", key: "gender", badge: true },
      { label: "Birth Date", key: "birthDate", fallback: "Not provided", span: 2 },
    ]
  },
  {
    title: "Contact Information",
    fields: [
      { label: "Email Address", key: "email" },
      { label: "Phone Number", key: "phone" },
    ]
  },
  {
    title: "Education Details",
    fields: [
      { label: "Course", key: "course", badge: true, variant: "outline" },
    ]
  },
  {
    title: "System Information",
    fields: [
      { label: "User ID", key: "id", mono: true },
    ]
  }
]

export function UserDetailsDialog({ user, open, onOpenChange }: UserDetailsDialogProps) {
  return (
    <Details
      data={user}
      open={open}
      onOpenChange={onOpenChange}
      title={user?.fullName || "User Details"}
      description="Complete user information and details"
      sections={userSections}
    />
  )
}