import { useEffect, useState } from 'react'
import { UserCheck, UserPlus, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router'
import { ROUTES } from '../../constants/routes.constant'

interface Student {
  name: string
  course: string
}

export function RecentEnrollments() {
  const [recentStudents, setRecentStudents] = useState<Student[]>([])
  const navigate = useNavigate()

  const updateRecentStudents = () => {
    const manualUsers = JSON.parse(localStorage.getItem('manualUsers') || '[]')
    console.log('Manual users from localStorage:', manualUsers)
    
    // Get the last 5 students with courses
    const studentsWithCourses = manualUsers
      .filter((user: any) => user.fullName && user.course)
      .map((user: any) => ({ name: user.fullName, course: user.course }))
      .slice(-5)
      .reverse()
    
    console.log('Students with courses:', studentsWithCourses)
    setRecentStudents(studentsWithCourses)
  }

  useEffect(() => {
    // Initial load
    updateRecentStudents()

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'manualUsers') {
        updateRecentStudents()
      }
    }

    // Listen for custom events (when adding users from same tab)
    const handleManualUsersUpdate = () => {
      updateRecentStudents()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('manualUsersUpdated', handleManualUsersUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('manualUsersUpdated', handleManualUsersUpdate)
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold">
          <UserCheck className="h-5 w-5 text-blue-600 mr-2" />
          Recent Enrollments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentStudents.length > 0 ? (
            <div className="space-y-2">
              {recentStudents.map((student, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{student.name}</span>
                  <span className="text-sm text-gray-600">{student.course}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No recent enrollments found</p>
              <p className="text-xs text-gray-400 mt-1">Add some students to see recent enrollments</p>
            </div>
          )}
          
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(ROUTES.MANUAL)}
              className="flex-1"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(ROUTES.MANUAL)}
              className="flex-1"
            >
              <Users className="h-4 w-4 mr-2" />
              View All Users
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}