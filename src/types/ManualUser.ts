export type ManualUser = {
  id: number
  dbId?: string 
  fullName: string
  age: number
  email: string
  phone: string
  birthDate: string
  course: string
  gender: 'Male' | 'Female' | 'Other'
}