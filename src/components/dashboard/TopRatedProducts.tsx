import { Star ,PackageSearch } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTopRatedProducts } from '../../hooks/useUser'

export function TopRatedProducts() {
  const { data: products = [], isLoading } = useTopRatedProducts()

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white transition-colors">Top Rated Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700  shadow-xl p-6  hover:scale-101 transition-transform duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white transition-colors text-lg font-semibold flex gap-3 items-center"> <PackageSearch className='dark:text-green-400 text-green-600'/>Top Rated Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.slice(0, 5).map((product: any) => (
            <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-3">
                <img 
                  src={product.thumbnail} 
                  alt={product.title}
                  className="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white transition-colors">
                    {product.title.length > 25 ? `${product.title.substring(0, 25)}...` : product.title}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400 ml-1 transition-colors">
                        {product.rating}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      ${product.price}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}