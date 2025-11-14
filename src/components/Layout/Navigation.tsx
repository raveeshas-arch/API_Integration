import { useLocation, useNavigate } from 'react-router'
import { ROUTES } from '../../constants'
import { Home, Users, Database, Settings, LayoutDashboard } from 'lucide-react'
import { Button } from '../ui/button'
import UserProfile from '../common/UserProfile'
import { DateTime } from '../common/DateTime'
import { ThemeToggle } from '../common/ThemeToggle'
import Dashboard from '../../pages/Dashboard';

interface LayoutProps {
  children: React.ReactNode
  isAuthenticated: boolean
}

const navItems = [
  { path: ROUTES.DASHBOARD, label: 'Home', icon: Home },
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

export function Layout({ children, isAuthenticated }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { title, subtitle } = getPageTitle(location.pathname)

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <nav className="w-52 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm flex flex-col fixed h-full transition-colors">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between transition-colors">
          <h2 className="font-bold text-blue-800 dark:text-blue-400 flex items-center gap-2 text-sm transition-colors">
            <LayoutDashboard className="h-6 w-6" /> Dashboard 
          </h2>
          <ThemeToggle />
        </div>

        <div className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? 'default' : 'ghost'}
              className={`w-full justify-start px-4 h-auto py-2 transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                  : 'text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
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

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2 transition-colors">
          <Button
            variant="ghost"
            className="w-full justify-start px-4 h-auto py-2 text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Button>
          <div className="pt-2">
            <UserProfile isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 ml-52 flex flex-col min-h-screen">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 flex-shrink-0 flex items-center justify-between transition-colors">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <DateTime />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors">
          {children}
        </main>
      </div>
    </div>
  )
}