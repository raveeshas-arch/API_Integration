import { useEffect, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer  } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface CategoryData {
  category: string
  count: number
  percentage: number
  fill: string
  [key: string]: any
}

const chartConfig = {
  count: {
    label: "Products",
  },
}

export function ProductCategoriesPieChart() {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products')
        const data = await response.json()
        
        const categoryCount: {[key: string]: number} = {}
        data.products.forEach((product: any) => {
          if (product.category) {
            categoryCount[product.category] = (categoryCount[product.category] || 0) + 1
          }
        })

        const colors = [
          '#3B82F6', 
          '#10B981',
          '#F59E0B', 
          '#EF4444'  
        ]

        const breakdown = Object.entries(categoryCount)
          .slice(0, 4)
          .map(([category, count], index) => ({
            category,
            count,
            percentage: (count / data.products.length) * 100,
            fill: colors[index % colors.length]
          }))

        setCategoryData(breakdown)
      } catch (error) {
        console.error('Error fetching category data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategoryData()
  }, [])

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors hover:scale-[1.02] duration-300 ease-in-out shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900 dark:text-white transition-colors">
            <div className="h-5 w-5 text-blue-600 mr-2 text-sm " />
            Product Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="w-60 h-60 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all hover:scale-[1.02] duration-300 ease-in-out shadow-lg">
      <CardHeader>
        <CardTitle className="flex  text-gray-900 dark:text-white transition-colors text-lg font-semibold  gap-3 items-center mt-5">
      <ShoppingCart className='dark:text-blue-400 text-blue-600 '/>
          Product Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={categoryData}
              dataKey="count"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
              animationBegin={0}
              animationDuration={800}
            >
              {categoryData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill}
                  className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        
        <div className="mt-4 space-y-2">
          {categoryData.map((item, index) => (
            <div key={item.category} className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.fill }}
                ></div>
                <span className="text-sm font-medium text-gray-700 dark:text-white capitalize transition-colors">
                  {item.category}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-white transition-colors">
                {item.count} ({item.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}