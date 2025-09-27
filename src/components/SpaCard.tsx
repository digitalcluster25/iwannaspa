import { Link } from 'react-router-dom'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { MapPin } from 'lucide-react'
import { Spa } from '../types/spa'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { useCategories, usePurposes } from '../hooks/useReferences'

interface SpaCardProps {
  spa: Spa
}

export function SpaCard({ spa }: SpaCardProps) {
  const { categories } = useCategories()
  const { purposes } = usePurposes()

  // Получаем все категории СПА
  const spaCategories = (spa.categories || (spa.category ? [spa.category] : []))
    .map(value => categories.find(c => c.value === value))
    .filter(Boolean)
    .slice(0, 2) // Показываем максимум 2 категории

  const hasMoreCategories = (spa.categories?.length || 0) > 2

  // Вычисляем диапазон цен услуг
  const servicePrices = spa.services?.map(service => service.price) || []
  const minPrice = servicePrices.length > 0 ? Math.min(...servicePrices) : 0
  const maxPrice = servicePrices.length > 0 ? Math.max(...servicePrices) : 0

  return (
    <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={spa.images[0]}
          alt={spa.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {spaCategories.map((cat, idx) => (
            <Badge key={idx} variant="secondary">
              {cat?.name}
            </Badge>
          ))}
          {hasMoreCategories && (
            <Badge variant="secondary">
              +{(spa.categories?.length || 0) - 2}
            </Badge>
          )}
        </div>
        {spa.featured && (
          <Badge className="absolute bottom-3 left-3 bg-primary">
            Рекомендуем
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <h3 className="text-lg leading-tight">{spa.name}</h3>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {spa.location}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {spa.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {(spa.purposes || (spa.purpose ? [spa.purpose] : []))
            .slice(0, 3)
            .map((purposeValue, index) => {
              const purpose = purposes.find(p => p.value === purposeValue)
              return purpose ? (
                <Badge key={index} variant="outline" className="text-xs">
                  {purpose.name}
                </Badge>
              ) : null
            })}
          {(spa.purposes?.length || 0) > 3 && (
            <Badge variant="outline" className="text-xs">
              +{(spa.purposes?.length || 0) - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-sm text-muted-foreground">
              {servicePrices.length === 0
                ? 'Информация о ценах'
                : minPrice === maxPrice
                  ? 'Процедуры от'
                  : 'Процедуры'}
            </span>
            <div>
              <span className="text-lg">
                {servicePrices.length === 0
                  ? 'уточняйте'
                  : minPrice === maxPrice
                    ? `${minPrice.toLocaleString()} ₴`
                    : `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} ₴`}
              </span>
            </div>
          </div>
          <Link to={`/spa/${spa.id}`}>
            <Button size="sm">Подробнее</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
