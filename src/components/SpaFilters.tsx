import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Slider } from './ui/slider'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { X } from 'lucide-react'
import { SpaFilters } from '../types/spa'
import { useCategories, usePurposes, useCities } from '../hooks/useReferences'

interface SpaFiltersProps {
  filters: SpaFilters
  onFiltersChange: (filters: SpaFilters) => void
  showBadges?: boolean
}

export function SpaFiltersComponent({
  filters,
  onFiltersChange,
  showBadges = true,
}: SpaFiltersProps) {
  const [priceRange, setPriceRange] = useState([
    filters.minPrice || 1800,
    filters.maxPrice || 3500,
  ])

  // Загружаем данные из справочников
  const { categories: categoriesData } = useCategories()
  const { purposes: purposesData } = usePurposes()
  const { cities: citiesData } = useCities()

  const categories = categoriesData
    .filter(c => c.active)
    .map(c => ({ value: c.value, label: c.name }))
  const purposes = purposesData
    .filter(p => p.active)
    .map(p => ({ value: p.value, label: p.name }))
  const locations = citiesData.filter(c => c.active).map(c => c.name)

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    onFiltersChange({
      ...filters,
      minPrice: value[0],
      maxPrice: value[1],
    })
  }

  const clearFilters = () => {
    setPriceRange([1800, 3500])
    onFiltersChange({})
  }

  const removeFilter = (key: keyof SpaFilters) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    if (key === 'minPrice' || key === 'maxPrice') {
      setPriceRange([1800, 3500])
      delete newFilters.minPrice
      delete newFilters.maxPrice
    }
    onFiltersChange(newFilters)
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Фильтры</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Horizontal Filters Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location Filter */}
          <div className="space-y-2">
            <label className="text-sm">Город</label>
            <Select
              value={filters.location || ''}
              onValueChange={value =>
                onFiltersChange({ ...filters, location: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Все города" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm">Категория услуг</label>
            <Select
              value={filters.category || ''}
              onValueChange={value =>
                onFiltersChange({ ...filters, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Все категории" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Purpose Filter */}
          <div className="space-y-2">
            <label className="text-sm">Цель посещения</label>
            <Select
              value={filters.purpose || ''}
              onValueChange={value =>
                onFiltersChange({ ...filters, purpose: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Любая цель" />
              </SelectTrigger>
              <SelectContent>
                {purposes.map(purpose => (
                  <SelectItem key={purpose.value} value={purpose.value}>
                    {purpose.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <label className="text-sm">Цена за процедуру</label>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                max={3500}
                min={1800}
                step={100}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{priceRange[0].toLocaleString()} ₴</span>
              <span>{priceRange[1].toLocaleString()} ₴</span>
            </div>
          </div>
        </div>

        {/* Active Filters Section - Below filters */}
        {hasActiveFilters && showBadges && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
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
                {priceRange[0].toLocaleString()} -{' '}
                {priceRange[1].toLocaleString()} ₴
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
      </CardContent>
    </Card>
  )
}
