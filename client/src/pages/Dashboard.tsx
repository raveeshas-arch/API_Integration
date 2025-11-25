import { Users, Database,  BookOpen ,ShoppingCart } from 'lucide-react'
import { CourseBreakdownChart } from '../components/dashboard/CourseBreakdownChart'
import { StatCard } from '../components/dashboard/StatCard'
import { RecentEnrollments } from '../components/dashboard/RecentEnrollments'
import { TopRatedProducts } from '../components/dashboard/TopRatedProducts'
import { ProductCategoriesPieChart } from '../components/dashboard/ProductCategoriesPieChart'
import { useManualUserStore } from '../stores/manualUserStore'
import { useProductCategoriesCount, useProductsCount } from '../hooks/useUser'

const Dashboard = () => {
  const users = useManualUserStore((state) => state.users)
  
  const { data: apiProductsCount = 0 } = useProductsCount()
  const { data: productCategoryCount = 0 } = useProductCategoriesCount()

  const coursesCount = [...new Set(users.map(user => user.course).filter(Boolean))].length

  const statsCards = [
    {
      title: 'Total Students',
      value: users.length,
      icon: Users,
      color: 'purple' as const
    },
    {
      title: 'Total Products',
      value: apiProductsCount,
      icon: Database,
      color: 'green' as const
    },
    {
      title: 'Active Courses',
      value: coursesCount,
      icon: BookOpen,
      color: 'orange' as const
    },{
      title:'products Categories',
      value: productCategoryCount,
      icon:ShoppingCart ,
      color: 'blue' as const
    }
  ]
  return (
    <div className="space-y-6 p-8 ">
      <div className="grid grid-cols-1  md:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopRatedProducts />
        <ProductCategoriesPieChart />
      </div>
    </div>
  )
}

export default Dashboard