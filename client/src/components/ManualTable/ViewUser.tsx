import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ManualUser } from "../../types/ManualUser"

interface ViewUserProps {
  user: ManualUser
  onViewUser?: (user: ManualUser) => void
}

export function ViewUser({ user, onViewUser }: ViewUserProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewUser?.(user)}
          className="h-8 w-8 p-0 text-blue-600 dark:text-blue-300 hover:text-blue-700"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>View</p>
      </TooltipContent>
    </Tooltip>
  )
}