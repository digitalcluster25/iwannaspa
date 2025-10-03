import { useState, useEffect } from 'react'
import {
  cityService,
  categoryService,
  purposeService,
  amenityService,
  serviceTemplateService,
  countryService,
} from '@/services/referenceService'
import type {
  City,
  Category,
  Purpose,
  Amenity,
  ServiceTemplate,
  Country,
} from '@/types/spa'

// Хук для работы со странами
export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadCountries()
  }, [])

  const loadCountries = async () => {
    try {
      setLoading(true)
      console.log('🌍 Loading countries...')
      const data = await countryService.getAll()
      console.log('✅ Countries loaded:', data.length)
      setCountries(data)
    } catch (err) {
      console.error('❌ Error loading countries:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { countries, loading, error, refetch: loadCountries }
}

// Хук для работы с городами
export function useCities() {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadCities()
  }, [])

  const loadCities = async () => {
    try {
      setLoading(true)
      console.log('🌆 Loading cities...')
      const data = await cityService.getAll()
      console.log('✅ Cities loaded:', data.length)
      setCities(data)
    } catch (err) {
      console.error('❌ Error loading cities:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { cities, loading, error, refetch: loadCities }
}

// Хук для работы с категориями
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      console.log('📂 Loading categories...')
      const data = await categoryService.getAll()
      console.log('✅ Categories loaded:', data.length)
      setCategories(data)
    } catch (err) {
      console.error('❌ Error loading categories:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { categories, loading, error, refetch: loadCategories }
}

// Хук для работы с назначениями
export function usePurposes() {
  const [purposes, setPurposes] = useState<Purpose[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadPurposes()
  }, [])

  const loadPurposes = async () => {
    try {
      setLoading(true)
      console.log('🎯 Loading purposes...')
      const data = await purposeService.getAll()
      console.log('✅ Purposes loaded:', data.length)
      setPurposes(data)
    } catch (err) {
      console.error('❌ Error loading purposes:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { purposes, loading, error, refetch: loadPurposes }
}

// Хук для работы с удобствами
export function useAmenities() {
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadAmenities()
  }, [])

  const loadAmenities = async () => {
    try {
      setLoading(true)
      console.log('✨ Loading amenities...')
      const data = await amenityService.getAll()
      console.log('✅ Amenities loaded:', data.length)
      setAmenities(data)
    } catch (err) {
      console.error('❌ Error loading amenities:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { amenities, loading, error, refetch: loadAmenities }
}

// Хук для работы с шаблонами услуг
export function useServiceTemplates() {
  const [services, setServices] = useState<ServiceTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setLoading(true)
      console.log('🛠️ Loading service templates...')
      const data = await serviceTemplateService.getAll()
      console.log('✅ Service templates loaded:', data.length)
      setServices(data)
    } catch (err) {
      console.error('❌ Error loading service templates:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { services, loading, error, refetch: loadServices }
}
