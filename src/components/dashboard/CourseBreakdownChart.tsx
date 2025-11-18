import { useEffect, useState } from 'react'
import { BookOpen } from 'lucide-react'

interface CourseData {
  course: string
  count: number
  percentage: number
}

export function CourseBreakdownChart() {
  const [courseBreakdown, setCourseBreakdown] = useState<CourseData[]>([])

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/users')
        const data = await response.json()
        
        if (data.success && data.users) {
          // Get course breakdown
          const courseCount: {[key: string]: number} = {}
          data.users.forEach((user: any) => {
            if (user.course) {
              courseCount[user.course] = (courseCount[user.course] || 0) + 1
            }
          })

          const breakdown = Object.entries(courseCount).map(([course, count]) => ({
            course,
            count,
            percentage: data.users.length > 0 ? (count / data.users.length) * 100 : 0
          }))

          setCourseBreakdown(breakdown)
        }
      } catch (error) {
        console.error('Failed to fetch course data:', error)
      }
    }

    fetchCourseData()
  }, [])

  return (
    <div className="bg-white rounded-lg border shadow-xl p-6 dark:bg-gray-800 hover:scale-101 transition-transform duration-300 ease-in-out ">
      <div className="flex items-center mb-4">
        <BookOpen className="h-5 w-5 text-orange-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Students by Course</h3>
      </div>
      <div className="space-y-3">
        {courseBreakdown.length > 0 ? (
          courseBreakdown.map((item, index) => {
            const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500']
            
            return (
              <div key={item.course} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-2`}></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-white">{item.course}</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-white">{item.count} students ({item.percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 ">
                  <div className={`${colors[index % colors.length]} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            )
          })
        ) : (
          <p className="text-gray-500 text-sm">No course data available</p>
        )}
      </div>
    </div>
  )
}