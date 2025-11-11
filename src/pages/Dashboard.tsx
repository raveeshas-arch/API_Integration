import { Users, Database,  BookOpen } from 'lucide-react'
import { CourseBreakdownChart } from '../components/dashboard/CourseBreakdownChart'
import { StatCard } from '../components/dashboard/StatCard'
import { RecentEnrollments } from '../components/dashboard/RecentEnrollments'
import { useManualUserStore } from '../stores/manualUserStore'
import { useProductsCount } from '../hooks/useUser'

const Dashboard = () => {
  const users = useManualUserStore((state) => state.users)
  
  const { data: apiProductsCount = 0 } = useProductsCount()

  const coursesCount = [...new Set(users.map(user => user.course).filter(Boolean))].length

  const statsCards = [
    {
      title: 'Total Students (Manual)',
      value: users.length,
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
  return (
    <div className="space-y-6 p-8 ">
      <div className="grid grid-cols-1  md:grid-cols-3 gap-6">
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