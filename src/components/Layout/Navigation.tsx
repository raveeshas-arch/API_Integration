import { Link, useLocation } from 'react-router'
import { ROUTES } from '../../constants/routes.constant'

interface LayoutProps {
  children: React.ReactNode
}

const navItems = [
  { path: ROUTES.MANUAL, label: 'Manual' },
  { path: ROUTES.API, label: 'API' },
]

export function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="p-4 bg-white border-b shadow-sm">
        <div className="max-w-[1500px] mx-auto">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`font-medium text-sm px-4 py-2 mr-4 rounded-md transition-colors ${
                location.pathname === item.path 
                  ? 'bg-black text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <main className="max-w-[1500px] mx-auto">
        {children}
      </main>
    </div>
  )
}