import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowRight, Loader2, Droplets } from 'lucide-react';
import { useSpaSearch } from '@/hooks/useSpas';
import { useCategories } from '@/hooks/useReferences';
import { SpaCard } from './SpaCard';

export function HomePage() {
  const { spas: featuredSpas, loading } = useSpaSearch({ featured: true });
  const { categories } = useCategories();

  return (
    <>
      {/* Hero Section with menu overlay */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Menu positioned absolutely on top */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="flex items-center justify-center py-4">
            <div className="
              flex items-center gap-6
              shadow-[0_2px_20px_-2px_rgba(0,0,0,0.1)]
              backdrop-blur-xl backdrop-saturate-150
              border border-white/30
              bg-white/15
              rounded-full
              px-6 py-2
              transition-all duration-300
              relative
              overflow-hidden
            ">
              {/* Acrylic noise overlay - minimal */}
              <div className="absolute inset-0 opacity-[0.003] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  backgroundSize: '200px 200px'
                }}
              />
              
              <Link to="/" className="flex items-center gap-2 relative z-10">
                <Droplets className="h-6 w-6 transition-colors text-white" />
                <span className="font-semibold transition-colors text-white">Iwanna</span>
              </Link>
              
              <span className="transition-colors relative z-10 text-white/80">|</span>
              
              <Link 
                to="/catalog" 
                className="text-sm font-medium transition-colors relative z-10 text-white hover:text-white/80"
              >
                Каталог СПА
              </Link>
            </div>
          </div>
        </div>
        
        {/* Hero background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/Viimsi-SPA.jpg)',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          {/* Glass effect overlay */}
          <div 
            className="absolute inset-0" 
            style={{
              background: 'rgba(238, 230, 230, 0.14)',
              backdropFilter: 'blur(4.5px)',
              WebkitBackdropFilter: 'blur(4.5px)',
            }}
          />
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
      <section className="container mx-auto px-4 mt-16">
        <div className="mb-12">
          <h2 className="text-3xl mb-4">Рекомендуемые СПА</h2>
          <p className="text-muted-foreground text-lg">
            Лучшие СПА-комплексы с высоким рейтингом
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : featuredSpas.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Пока нет рекомендуемых СПА
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredSpas.map(spa => (
              <SpaCard key={spa.id} spa={spa} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="bg-muted/30 py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl mb-4">Категории СПА</h2>
            <p className="text-muted-foreground text-lg">
              Выберите тип СПА, который подходит именно вам
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories
              .filter(cat => cat.active)
              .map(category => (
                <Link
                  key={category.id}
                  to={`/catalog?category=${category.value}`}
                >
                  <Card className="text-center p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="space-y-2">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Найдите идеальный СПА-комплекс
                      </p>
                      <p className="text-primary font-medium">Смотреть →</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}
