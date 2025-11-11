import React from 'react'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { registerAdmin } from '@/apis/admin'
import { registerSchema, type RegisterFormData } from '@/lib/validations'

const Register = () => {
    const navigate = useNavigate()

    const [formData, setFormData] = React.useState<RegisterFormData>({
        name: '',
        email: '',
        password: ''
    })
    const [errors, setErrors] = React.useState<Partial<RegisterFormData>>({})

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrors({})
        
        const result = registerSchema.safeParse(formData)
        if (!result.success) {
            const fieldErrors: Partial<RegisterFormData> = {}
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof RegisterFormData
                fieldErrors[field] = issue.message
            })
            setErrors(fieldErrors)
            return
        }

        try {
            const response = await registerAdmin(formData)
            toast.success(response.message || 'Account created successfully!')
            navigate('/login')
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Registration failed'
            toast.error(errorMessage)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form 
                onSubmit={handleSubmit} 
                className="sm:w-[400px] w-full text-center border border-gray-300/60 rounded-2xl px-8 py-8 bg-white space-y-6"
            >
                <div>
                    <h1 className="text-gray-900 text-3xl font-medium">Sign up</h1>
                    <p className="text-gray-500 text-sm mt-2">Create your account</p>
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2 text-left">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    
                    <div className="space-y-2 text-left">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    
                    <div className="space-y-2 text-left">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>
                    
                 
                </div>
                
                <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600">
                    Sign up
                </Button>
                
                <p className="text-gray-500 text-sm">
                    Already have an account?{' '}
                    <button 
                        type="button"
                        onClick={() => navigate('/login')} 
                        className="text-indigo-500 hover:underline"
                    >
                        click here
                    </button>
                </p>
            </form>
        </div>
    )
}

export default Register