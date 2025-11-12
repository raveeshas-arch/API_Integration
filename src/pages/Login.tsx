import React from 'react'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { loginAdmin } from '@/apis/admin'
import { loginSchema, type LoginFormData } from '@/lib/validations'

const Login = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = React.useState<LoginFormData>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = React.useState<Partial<LoginFormData>>({})
  const [showPassword, setShowPassword] = React.useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    const result = loginSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<LoginFormData> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormData
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    try {
      const response = await loginAdmin(formData)
      localStorage.setItem('token', 'dummy-token')
      localStorage.setItem('admin', JSON.stringify(response.admin))
      toast.success(response.message || 'Login successful!')
      window.location.href = '/'
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      toast.error(errorMessage)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[400px] w-full text-center border border-gray-300/60 rounded-2xl px-8 py-8 bg-white space-y-6"
      >
        <div>
          <h1 className="text-gray-900 text-3xl font-medium">Login</h1>
          <p className="text-gray-500 text-sm mt-2">Please sign in to continue</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2 text-left">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
          </div>
          
          <div className="space-y-2 text-left">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
          </div>
        </div>

        <div className="text-left">
          <Button variant="link" className="text-indigo-500 p-0 h-auto text-sm">
            Forget password?
          </Button>
        </div>

        <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600">
          Login
        </Button>

        <p className="text-gray-500 text-sm">
          Don't have an account?{' '}
          <button 
            type="button"
            onClick={() => navigate('/register')} 
            className="text-indigo-500 hover:underline"
          >
            click here
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login