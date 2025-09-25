import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { mockSpas } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HomePage() {
  const featuredSpas = mockSpas.filter(spa => spa.featured);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://via.placeholder.com/1200x600/6366f1/ffffff?text=Iwanna+SPA)'
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl mb-6">
            Найдите идеальный СПА для вашего отдыха
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Лучшие СПА-комплексы Украины в Киеве, Одессе, Львове и Буковеле
          </p>
          <Link to="/catalog">
            <Button size="lg" className="text-lg px-8 py-3">
              Смотреть каталог
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Spas */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">Рекомендуемые СПА</h2>
          <p className="text-muted-foreground text-lg">
            Лучшие СПА-комплексы с высоким рейтингом
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredSpas.map((spa) => (
            <Card key={spa.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={spa.images[0]}
                  alt={spa.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3" variant="secondary">
                  Рекомендуем
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{spa.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({spa.reviewCount} отзывов)
                  </span>
                </div>
                
                <h3 className="text-lg mb-2">{spa.name}</h3>
                
                <div className="flex items-center gap-1 mb-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {spa.location}
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {spa.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg">от {spa.price.toLocaleString()} ₽</span>
                    <span className="text-sm text-muted-foreground">/день</span>
                  </div>
                  <Link to={`/spa/${spa.id}`}>
                    <Button variant="outline" size="sm">
                      Подробнее
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/catalog">
            <Button variant="outline" size="lg">
              Посмотреть все СПА
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Категории СПА</h2>
            <p className="text-muted-foreground text-lg">
              Выберите тип СПА, который подходит именно вам
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Wellness', description: 'Комплексные wellness программы', count: '6+' },
              { name: 'Thermal', description: 'Термальные источники', count: '3+' },
              { name: 'Medical', description: 'Медицинские СПА', count: '4+' },
              { name: 'Beauty', description: 'Косметологические процедуры', count: '8+' }
            ].map((category, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-md transition-shadow">
                <CardContent className="space-y-2">
                  <h3 className="text-lg">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <p className="text-primary">{category.count} объектов</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}