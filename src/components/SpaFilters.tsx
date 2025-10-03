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
import { useCategories, usePurposes, useCities, useCountries } from '../hooks/useReferences'

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
  const { countries: countriesData } = useCountries()

  const categories = categoriesData
    .filter(c => c.active)
    .map(c => ({ value: c.value, label: c.name }))
  const purposes = purposesData
    .filter(p => p.active)
    .map(p => ({ value: p.value, label: p.name }))
  const locations = citiesData.filter(c => c.active).map(c => c.name)
  const countries = countriesData.filter(c => c.active).map(c => ({ value: c.id, label: c.name }))

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
        <div className="flex gap-4">
          {/* Country Filter */}
          <div className="space-y-2 flex-1">
            <label className="text-sm">Страна</label>
            <Select
              value={filters.country || ''}
              onValueChange={value =>
                onFiltersChange({ ...filters, country: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Все страны" />
              </SelectTrigger>
              <SelectContent>
                {countries.map(country => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Filter */}
          <div className="space-y-2 flex-1">
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
          <div className="space-y-2 flex-1">
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
          <div className="space-y-2 flex-1">
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
          <div className="space-y-3 flex-[1.5]">
            <div>
              <label className="text-sm font-semibold">Цена за процедуру</label>
              <p className="text-sm text-muted-foreground mt-1">
                {priceRange[0].toLocaleString()} ₴ — {priceRange[1].toLocaleString()}+ ₴
              </p>
            </div>
            
            <div className="space-y-6 pt-4">
              {/* Гистограмма */}
              <div className="flex items-end justify-between gap-1 h-16 px-2">
                {[30, 45, 60, 80, 90, 70, 85, 95, 75, 60, 55, 40, 50, 45, 35, 30, 25, 20, 15, 10].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gray-400 rounded-sm opacity-70"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              
              {/* Слайдер под гистограммой */}
              <div className="px-2 py-2">
                <Slider
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  max={3500}
                  min={1800}
                  step={100}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Section - Below filters */}
        {hasActiveFilters && showBadges && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Очистить
            </Button>
            {filters.country && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {countries.find(c => c.value === filters.country)?.label}
                <button
                  type="button"
                  className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    removeFilter('country')
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
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
