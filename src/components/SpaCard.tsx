import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin } from 'lucide-react';
import { Spa } from '../types/spa';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SpaCardProps {
  spa: Spa;
}

export function SpaCard({ spa }: SpaCardProps) {
  const categoryLabels = {
    wellness: 'Wellness',
    thermal: 'Термальный',
    medical: 'Медицинский',
    beauty: 'Beauty'
  };

  // Вычисляем диапазон цен услуг
  const servicePrices = spa.services?.map(service => service.price) || [];
  const minPrice = servicePrices.length > 0 ? Math.min(...servicePrices) : 0;
  const maxPrice = servicePrices.length > 0 ? Math.max(...servicePrices) : 0;

  return (
    <Card className="group hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={spa.images[0]}
          alt={spa.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 left-3" variant="secondary">
          {categoryLabels[spa.category]}
        </Badge>
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
          {spa.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {typeof amenity === 'string' ? amenity : amenity.name}
            </Badge>
          ))}
          {spa.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{spa.amenities.length - 3}
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
                  : 'Процедуры'
              }
            </span>
            <div>
              <span className="text-lg">
                {servicePrices.length === 0 
                  ? 'уточняйте'
                  : minPrice === maxPrice 
                    ? `${minPrice.toLocaleString()} ₴`
                    : `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} ₴`
                }
              </span>
            </div>
          </div>
          <Link to={`/spa/${spa.id}`}>
            <Button size="sm">
              Подробнее
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}