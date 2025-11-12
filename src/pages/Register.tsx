import React from 'react'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { registerAdmin } from '@/apis/admin'
import { Eye, EyeOff } from 'lucide-react'

const Register = () => {
    const navigate = useNavigate()

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (!formData.name || !formData.email || !formData.password) {
            toast.error('Please fill all required fields')
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
                            required
                        />
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
                            required
                        />
                    </div>
                    
                    <div className="space-y-2 text-left">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                className="pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
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