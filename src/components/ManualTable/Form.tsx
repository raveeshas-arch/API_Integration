import { UserRoundPlus } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "../ui/calender"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
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
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ManualUser } from "../../types/ManualUser"
import { useState } from "react"
import toast from 'react-hot-toast'
import { MESSAGES } from '../../constants'


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
  gender: z.enum(["Male", "Female"]).refine(val => val !== undefined, "Please select a gender"),
  birthDate: z.date().optional(),
  course: z.string().min(1, "Please select a course"),
})

type FormData = z.infer<typeof formSchema>

interface FormProps {
  onAddUser: (user: ManualUser) => void
}

const Form = ({ onAddUser }: FormProps) => {
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

  const onSubmit = async (data: FormData) => {
    const newUser: ManualUser = {
      id: Date.now(),
      fullName: data.fullName,
      age: parseInt(data.age),
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      birthDate: data.birthDate ? format(data.birthDate, "yyyy-MM-dd") : "",
      course: data.course,
    }

    try {
      // Save to database
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      })
     
       const result = await response.json()
      if (response.ok) {
       
        // Add the database ID to the user
        const userWithDbId = {
          ...newUser,
          dbId: result.user._id
        }
        onAddUser(userWithDbId);
        toast.success(result.message || MESSAGES.USER_ADDED);
        form.reset();
        setOpen(false);
      } else {
        toast.error(result.error || 'Failed to save user');
      }
    } catch (error) {
      // Check if it's a network/connection error
      if (error instanceof Error && (error.name === 'TypeError' || error.message.includes('fetch'))) {
        toast.error('Connection error - Server not available');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Connection error - Server not available';
        toast.error(errorMessage);
      }
      console.error('Error:', error);
    }
  }



  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="font-bold bg-gray-200 hover:bg-black hover:text-white cursor-pointer">
            <UserRoundPlus />
            Add New User</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Fill in the user details below.
            </DialogDescription>
          </DialogHeader>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Generate form fields from map */}
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
                <Button type="submit">Add User</Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Form
