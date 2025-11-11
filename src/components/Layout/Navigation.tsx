import { useLocation, useNavigate } from 'react-router'
import { ROUTES } from '../../constants'
import { Home, Users, Database, Settings, Menu } from 'lucide-react'
import { Button } from '../ui/button'
import { useState } from 'react'
import UserProfile from '../common/UserProfile'

interface LayoutProps {
  children: React.ReactNode
}

const navItems = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: Home },
  { path: ROUTES.MANUAL, label: 'Manual', icon: Users },
  { path: ROUTES.API, label: 'API Products', icon: Database },
]

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case ROUTES.DASHBOARD:
      return { title: 'Dashboard', subtitle: 'Overview & Analytics' }
    case ROUTES.MANUAL:
      return { title: 'Manual Users', subtitle: 'Manage and track manual users' }
    case ROUTES.API:
      return { title: 'API Users', subtitle: 'Manage API integrated users' }
    default:
      return { title: 'Dashboard', subtitle: 'Welcome to Student Management Portal' }
  }
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { title, subtitle } = getPageTitle(location.pathname)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <nav className={`${isCollapsed ? 'w-16' : 'w-64'} min-w-16 bg-white border-r shadow-sm flex flex-col fixed h-full transition-all duration-300`}>
        <div className={`p-6 border-b flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && <h2 className="text-xl font-bold text-gray-900">Student Portal</h2>}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-4'} h-auto py-3 ${
                location.pathname === item.path 
                  ? 'bg-gray-200 text-black hover:bg-gray-200' 
                  : 'text-black'
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className={`h-5 w-5 ${!isCollapsed ? 'mr-3' : ''}`} />
              {!isCollapsed && item.label}
            </Button>
          ))}
        </div>
        
        <div className="p-4 border-t space-y-2">
          <Button variant="ghost" className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-4'} h-auto py-3 text-black`}>
            <Settings className={`h-5 w-5 ${!isCollapsed ? 'mr-3' : ''}`} />
            {!isCollapsed && 'Settings'}
          </Button>
        </div>
      </nav>
      
      <div className={`flex-1 ${isCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 flex flex-col h-screen`}>
        <header className="bg-white border-b px-8 py-4 flex-shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
          <UserProfile />
        </header>

        <main className="flex-1 overflow-hidden bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}