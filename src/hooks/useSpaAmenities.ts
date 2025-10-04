import { useState, useEffect } from 'react'
import { spaAmenitiesService, type SpaAmenityWithDetails } from '@/services/spaAmenitiesService'
import { useAmenities } from './useReferences'
import { toast } from 'sonner'

export function useSpaAmenities(spaId: string | undefined) {
  const [spaAmenities, setSpaAmenities] = useState<SpaAmenityWithDetails[]>([])
  const [loading, setLoading] = useState(!!spaId)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (spaId) {
      loadSpaAmenities()
    }
  }, [spaId])

  const loadSpaAmenities = async () => {
    if (!spaId) return

    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Loading spa amenities for spa:', spaId)
      const data = await spaAmenitiesService.getBySpaId(spaId)
      console.log('✅ Spa amenities loaded:', data.length)
      setSpaAmenities(data)
    } catch (err) {
      console.error('❌ Error loading spa amenities:', err)
      setError(err as Error)
      toast.error('Ошибка загрузки удобств СПА')
    } finally {
      setLoading(false)
    }
  }

  const addAmenity = async (amenityId: string, customDescription?: string) => {
    if (!spaId) return

    try {
      console.log('➕ Adding amenity to spa:', { spaId, amenityId, customDescription })
      const newAmenity = await spaAmenitiesService.addAmenity(spaId, amenityId, customDescription)
      
      // Перезагружаем список для получения полной информации
      await loadSpaAmenities()
      
      toast.success('Удобство добавлено')
      return newAmenity
    } catch (err) {
      console.error('❌ Error adding amenity:', err)
      toast.error('Ошибка добавления удобства')
      throw err
    }
  }

  const updateAmenity = async (amenityId: string, customDescription?: string) => {
    if (!spaId) return

    try {
      console.log('✏️ Updating amenity:', { spaId, amenityId, customDescription })
      const updatedAmenity = await spaAmenitiesService.updateAmenity(spaId, amenityId, customDescription)
      
      // Обновляем локальное состояние
      setSpaAmenities(prev => 
        prev.map(amenity => 
          amenity.amenity_id === amenityId 
            ? { ...amenity, custom_description: customDescription }
            : amenity
        )
      )
      
      toast.success('Удобство обновлено')
      return updatedAmenity
    } catch (err) {
      console.error('❌ Error updating amenity:', err)
      toast.error('Ошибка обновления удобства')
      throw err
    }
  }

  const removeAmenity = async (amenityId: string) => {
    if (!spaId) return

    try {
      console.log('🗑️ Removing amenity from spa:', { spaId, amenityId })
      await spaAmenitiesService.removeAmenity(spaId, amenityId)
      
      // Удаляем из локального состояния
      setSpaAmenities(prev => prev.filter(amenity => amenity.amenity_id !== amenityId))
      
      toast.success('Удобство удалено')
    } catch (err) {
      console.error('❌ Error removing amenity:', err)
      toast.error('Ошибка удаления удобства')
      throw err
    }
  }

  return {
    spaAmenities,
    loading,
    error,
    addAmenity,
    updateAmenity,
    removeAmenity,
    refetch: loadSpaAmenities
  }
}

export function useAvailableAmenities(spaId: string | undefined) {
  const [availableAmenities, setAvailableAmenities] = useState<any[]>([])
  const [loading, setLoading] = useState(!!spaId)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (spaId) {
      loadAvailableAmenities()
    }
  }, [spaId])

  const loadAvailableAmenities = async () => {
    if (!spaId) return

    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Loading available amenities for spa:', spaId)
      const data = await spaAmenitiesService.getAvailableAmenities(spaId)
      console.log('✅ Available amenities loaded:', data.length)
      setAvailableAmenities(data)
    } catch (err) {
      console.error('❌ Error loading available amenities:', err)
      setError(err as Error)
      toast.error('Ошибка загрузки доступных удобств')
    } finally {
      setLoading(false)
    }
  }

  return {
    availableAmenities,
    loading,
    error,
    refetch: loadAvailableAmenities
  }
}
