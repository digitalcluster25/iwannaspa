import { useState, useEffect } from 'react'
import { 
  cityService, 
  categoryService, 
  purposeService, 
  amenityService,
  serviceTemplateService
} from '@/services/referenceService'
import type { City, Category, Purpose, Amenity, ServiceTemplate } from '@/types/spa'

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
      const data = await cityService.getAll()
      setCities(data)
    } catch (err) {
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
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (err) {
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
      const data = await purposeService.getAll()
      setPurposes(data)
    } catch (err) {
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
      const data = await amenityService.getAll()
      setAmenities(data)
    } catch (err) {
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
      const data = await serviceTemplateService.getAll()
      setServices(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { services, loading, error, refetch: loadServices }
}
