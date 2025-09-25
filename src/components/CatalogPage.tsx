import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import { SpaCard } from './SpaCard';
import { SpaFiltersComponent } from './SpaFilters';
import { mockSpas } from '../data/mockData';
import { SpaFilters } from '../types/spa';

export function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filters, setFilters] = useState<SpaFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedSpas = useMemo(() => {
    let result = [...mockSpas];

    // Apply search
    if (searchTerm) {
      result = result.filter(spa =>
        spa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spa.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spa.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.category) {
      result = result.filter(spa => spa.category === filters.category);
    }
    if (filters.purpose) {
      result = result.filter(spa => spa.purpose === filters.purpose);
    }
    if (filters.location) {
      result = result.filter(spa => spa.location === filters.location);
    }
    if (filters.minPrice) {
      result = result.filter(spa => spa.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      result = result.filter(spa => spa.price <= filters.maxPrice!);
    }
    if (filters.minRating) {
      result = result.filter(spa => spa.rating >= filters.minRating!);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [searchTerm, sortBy, filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-6">Каталог СПА комплексов</h1>
        
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Поиск СПА..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 sm:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Фильтры
          </Button>
        </div>
        
        {/* Filters Row - Always visible on desktop */}
        <div className={`mb-4 ${showFilters ? 'block' : 'hidden sm:block'}`}>
          <SpaFiltersComponent 
            filters={filters} 
            onFiltersChange={setFilters}
          />
        </div>
        
        {/* Results Count and Sort Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-muted-foreground">
            Найдено {filteredAndSortedSpas.length} СПА комплексов
          </p>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">По рейтингу</SelectItem>
              <SelectItem value="price-low">Сначала дешевые</SelectItem>
              <SelectItem value="price-high">Сначала дорогие</SelectItem>
              <SelectItem value="name">По названию</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Spas Grid */}
      <div>
        {filteredAndSortedSpas.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedSpas.map((spa) => (
              <SpaCard key={spa.id} spa={spa} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              СПА комплексы не найдены
            </p>
            <p className="text-muted-foreground mb-6">
              Попробуйте изменить параметры поиска или фильтры
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setFilters({});
            }}>
              Сбросить все фильтры
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}