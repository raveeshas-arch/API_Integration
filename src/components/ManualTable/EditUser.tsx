import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "../ui/calender"
import { CalendarIcon, Edit } from "lucide-react"
import { format, parse } from "date-fns"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ManualUser } from "../../types/ManualUser"
import toast from 'react-hot-toast'
import { MESSAGES } from '../../constants'
import { API_ENDPOINTS } from '../../config/api'

const formFields = [
  { name: "fullName", label: "Full Name", type: "text" },
  { name: "age", label: "Age", type: "number" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "text" },
] as const

const courseOptions = [
  { value: "Blockchain Solution Architect", label: "Blockchain Solution Architect" },
  { value: "UI/UX Designer", label: "UI/UX Designer" },
  { value: "Full Stack Engineer", label: "Full Stack Engineer" },
  { value: "Game Sysytem Architect", label: "Game Sysytem Architect" },
  { value: "Robotics Engineer", label: "Robotics Engineer" },
  { value: "Quality Assurance Engineer", label: "Quality Assurance Engineer" },
  { value: "Mobile Engineering", label: "Mobile Engineering" },
] as const

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  age: z.string().refine((val) => {
    const num = parseInt(val)
    return num >= 18 && num <= 120
  }, "Age must be between 18 and 120"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: z.enum(["Male", "Female", "Other"]).refine(val => val !== undefined, "Please select a gender"),
  birthDate: z.date().optional(),
  course: z.string().min(1, "Please select a course"),
})

type FormData = z.infer<typeof formSchema>

interface EditUserProps {
  user: ManualUser
  onUpdateUser?: (user: ManualUser) => void
}

export function EditUser({ user, onUpdateUser }: EditUserProps) {
  const [open, setOpen] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      age: "",
      email: "",
      phone: "",
      gender: undefined,
      course: "",
    },
  })

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      form.reset({
        fullName: user.fullName,
        age: user.age.toString(),
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        course: user.course,
        birthDate: user.birthDate ? parse(user.birthDate, "yyyy-MM-dd", new Date()) : undefined,
      })
    }
  }

  const onSubmit = async (data: FormData) => {
  const updatedUser: ManualUser = {
    ...user,
    fullName: data.fullName,
    age: parseInt(data.age),
    email: data.email,
    phone: data.phone,
    gender: data.gender,
    birthDate: data.birthDate ? format(data.birthDate, "yyyy-MM-dd") : "",
    course: data.course,
  }

  try {
    const response = await fetch(`${API_ENDPOINTS.USERS}/${user.dbId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedUser)
    })

    const result = await response.json()
    
    if (response.ok) {
      onUpdateUser?.(updatedUser)
      toast.success(result.message || MESSAGES.USER_UPDATED)
      setOpen(false)
    } else {
      toast.error(result.error || 'Failed to update user')
    }
  } catch (error) {
    toast.error('Error updating user')
    console.error('Error:', error)
  }
}


  return (
    <Tooltip>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 dark:text-green-400"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to user information here.
            </DialogDescription>
          </DialogHeader>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {formFields.map(({ name, label, type }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input type={type} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          captionLayout="dropdown"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Gender select field */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Course select field */}
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courseOptions.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
      <TooltipContent>
        <p>Edit</p>
      </TooltipContent>
    </Tooltip>
  )
}