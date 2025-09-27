import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { SpaCard } from './SpaCard'
import { SpaFiltersComponent } from './SpaFilters'
import { useSpas } from '../hooks/useSpas'
import { useCategories, usePurposes } from '../hooks/useReferences'
import { SpaFilters } from '../types/spa'

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [filters, setFilters] = useState<SpaFilters>({})
  const [showFilters, setShowFilters] = useState(false)

  // Получаем данные из Supabase
  const { spas, loading, error } = useSpas()
  const { categories: categoriesData } = useCategories()
  const { purposes: purposesData } = usePurposes()

  const categories = categoriesData
    .filter(c => c.active)
    .map(c => ({ value: c.value, label: c.name }))
  const purposes = purposesData
    .filter(p => p.active)
    .map(p => ({ value: p.value, label: p.name }))

  // Применяем фильтры из URL при загрузке
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    const purposeFromUrl = searchParams.get('purpose')
    const locationFromUrl = searchParams.get('location')

    if (categoryFromUrl || purposeFromUrl || locationFromUrl) {
      setFilters(prev => ({
        ...prev,
        ...(categoryFromUrl && { category: categoryFromUrl }),
        ...(purposeFromUrl && { purpose: purposeFromUrl }),
        ...(locationFromUrl && { location: locationFromUrl }),
      }))
    }
  }, [searchParams])

  const filteredAndSortedSpas = useMemo(() => {
    let result = [...spas]

    // Apply search
    if (searchTerm) {
      result = result.filter(
        spa =>
          spa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          spa.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          spa.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply filters
    if (filters.category) {
      result = result.filter(
        spa =>
          spa.categories?.includes(filters.category as any) ||
          spa.category === filters.category
      )
    }
    if (filters.purpose) {
      result = result.filter(
        spa =>
          spa.purposes?.includes(filters.purpose as any) ||
          spa.purpose === filters.purpose
      )
    }
    if (filters.location) {
      result = result.filter(spa => spa.location === filters.location)
    }
    if (filters.minPrice) {
      result = result.filter(spa => spa.price >= filters.minPrice!)
    }
    if (filters.maxPrice) {
      result = result.filter(spa => spa.price <= filters.maxPrice!)
    }
    if (filters.minRating) {
      result = result.filter(spa => spa.rating >= filters.minRating!)
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return result
  }, [spas, searchTerm, sortBy, filters])

  const removeFilter = (key: keyof SpaFilters) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    if (key === 'minPrice' || key === 'maxPrice') {
      delete newFilters.minPrice
      delete newFilters.maxPrice
    }
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  // Loading состояние
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Загрузка СПА комплексов...
          </p>
        </div>
      </div>
    )
  }

  // Error состояние
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-destructive text-lg mb-4">
            Ошибка загрузки данных
          </p>
          <p className="text-muted-foreground mb-6">{error.message}</p>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </div>
    )
  }

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
              onChange={e => setSearchTerm(e.target.value)}
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
          <SpaFiltersComponent filters={filters} onFiltersChange={setFilters} showBadges={showFilters} />
        </div>

        {/* Active Filters Badges - Show on mobile when filters are CLOSED */}
        {hasActiveFilters && !showFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4 sm:hidden">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Очистить
            </Button>
            {filters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {categories.find(c => c.value === filters.category)?.label}
                <button
                  type="button"
                  className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    removeFilter('category')
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.location}
                <button
                  type="button"
                  className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    removeFilter('location')
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.purpose && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {purposes.find(p => p.value === filters.purpose)?.label}
                <button
                  type="button"
                  className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    removeFilter('purpose')
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {(filters.minPrice || 1800).toLocaleString()} -{' '}
                {(filters.maxPrice || 3500).toLocaleString()} ₴
                <button
                  type="button"
                  className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    removeFilter('minPrice')
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Results Count and Sort Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-muted-foreground">
            Найдено {filteredAndSortedSpas.length} СПА комплексов
          </p>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
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
            {filteredAndSortedSpas.map(spa => (
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
            <Button
              onClick={() => {
                setSearchTerm('')
                setFilters({})
                setSearchParams({}) // Очищаем URL параметры
              }}
            >
              Сбросить все фильтры
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
