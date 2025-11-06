import { UserCheck, UserPlus, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router'
import { ROUTES } from '../../constants'
import { useManualUserStore } from '../../stores/manualUserStore'

export function RecentEnrollments() {
  const users = useManualUserStore((state) => state.users)
  const navigate = useNavigate()

  // Get the last 5 students with courses
  const recentStudents = users
    .filter(user => user.fullName && user.course)
    .slice(0, 5)
    .map(user => ({ name: user.fullName, course: user.course }))

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