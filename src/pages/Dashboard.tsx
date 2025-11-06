import { useEffect, useState } from 'react'
import { Users, Database, BarChart3, BookOpen } from 'lucide-react'
import { CourseBreakdownChart } from '../components/dashboard/CourseBreakdownChart'
import { StatCard } from '../components/dashboard/StatCard'
import { RecentEnrollments } from '../components/dashboard/RecentEnrollments'

const Dashboard = () => {
  const [manualUsersCount, setManualUsersCount] = useState(0)
  const [apiProductsCount, setApiProductsCount] = useState(0)
  const [coursesCount, setCoursesCount] = useState(0)

  const statsCards = [
    {
      title: 'Total Students (Manual)',
      value: manualUsersCount,
      icon: Users,
      color: 'purple' as const
    },
    {
      title: 'Total Products (API)',
      value: apiProductsCount,
      icon: Database,
      color: 'green' as const
    },
    {
      title: 'Active Courses',
      value: coursesCount,
      icon: BookOpen,
      color: 'orange' as const
    }
  ]

  useEffect(() => {
    // Get manual users from localStorage
    const manualUsers = JSON.parse(localStorage.getItem('manualUsers') || '[]')
    setManualUsersCount(manualUsers.length)

    // Get unique courses count
    const uniqueCourses = [...new Set(manualUsers.map((user: any) => user.course).filter(Boolean))]
    setCoursesCount(uniqueCourses.length)

    // Fetch API products count
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then(data => setApiProductsCount(data.total || 0))
      .catch(() => setApiProductsCount(0))
  }, [])


  return (
    <div className="space-y-6 p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((card, index) => (
          <StatCard 
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentEnrollments />
        <CourseBreakdownChart />
      </div>
    </div>
  )
}

export default Dashboard