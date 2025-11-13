import { useLocation, useNavigate } from 'react-router'
import { ROUTES } from '../../constants'
import { Home, Users, Database, Settings, GraduationCap } from 'lucide-react'
import { Button } from '../ui/button'
import UserProfile from '../common/UserProfile'
import { DateTime } from '../common/DateTime'

interface LayoutProps {
  children: React.ReactNode
}

const navItems = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: Home },
  { path: ROUTES.MANUAL, label: 'Manual', icon: Users },
  { path: ROUTES.API, label: 'API ', icon: Database },
]

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case ROUTES.DASHBOARD:
      return { title: 'Dashboard', subtitle: 'Overview & Analytics' }
    case ROUTES.MANUAL:
      return { title: 'Manual Users', subtitle: 'Manage and track Students' }
    case ROUTES.API:
      return { title: 'API Products', subtitle: 'Manage API integrated Products' }
    case '/account':
      return { title: 'My Account', subtitle: 'Manage your account settings' }
    default:
      return { title: 'Dashboard', subtitle: 'Welcome to Student Management Portal' }
  }
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { title, subtitle } = getPageTitle(location.pathname)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <nav className="w-52 bg-white border-r shadow-sm flex flex-col fixed h-full">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="font-bold text-blue-800 flex items-center gap-2 text-sm">
            <GraduationCap className="h-6 w-6" /> River High School
          </h2>
        </div>

        <div className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? 'default' : 'ghost'}
              className={`w-full justify-start px-4 h-auto py-2 transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-gray-200 text-black hover:bg-gray-200'
                  : 'text-black hover:bg-gray-100'
              }`}
              onClick={(e) => {
                e.preventDefault()
                navigate(item.path)
              }}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Button>
          ))}
        </div>

        <div className="p-4 border-t space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start px-4 h-auto py-2 text-black hover:bg-gray-100 transition-all duration-200"
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Button>
          <div className="pt-2">
            <UserProfile />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 ml-52 flex flex-col h-screen">
        <header className="bg-white border-b px-8 py-4 flex-shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
          <DateTime />
        </header>

        <main className="flex-1 overflow-hidden bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
