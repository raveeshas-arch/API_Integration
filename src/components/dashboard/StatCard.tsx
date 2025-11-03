import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../ui/card'

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: 'purple' | 'green' | 'orange' | 'blue'
}

export function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    purple: {
      border: 'border-l-purple-500',
      text: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    green: {
      border: 'border-l-green-500',
      text: 'text-green-600',
      bg: 'bg-green-100'
    },
    orange: {
      border: 'border-l-orange-500',
      text: 'text-orange-600',
      bg: 'bg-orange-100'
    },
    blue: {
      border: 'border-l-blue-500',
      text: 'text-blue-600',
      bg: 'bg-blue-100'
    }
  }

  const colors = colorClasses[color]

  return (
    <Card className={`border-l-4 ${colors.border}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className={`text-sm font-medium ${colors.text}`}>{title}</h3>
        <div className={`${colors.bg} p-3 rounded-lg`}>
          <Icon className={`h-6 w-6 ${colors.text}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}