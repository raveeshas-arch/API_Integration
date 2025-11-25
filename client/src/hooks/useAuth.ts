import { useState, useEffect } from 'react'

export const useAuth = () => {
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const role = localStorage.getItem('role')
    setUserRole(role)
  }, [])

  return { userRole, isAdmin: userRole === 'admin' }
}