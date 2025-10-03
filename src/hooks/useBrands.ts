import { useState, useEffect } from 'react'
import { brandService } from '@/services/brandService'
import type { Brand } from '@/types/spa'

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    try {
      setLoading(true)
      console.log('🏢 Loading brands...')
      const data = await brandService.getAll()
      console.log('✅ Brands loaded:', data.length)
      setBrands(data)
    } catch (err) {
      console.error('❌ Error loading brands:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { brands, loading, error, refetch: loadBrands }
}

export function useVendorBrands(vendorId?: string) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (vendorId) {
      loadBrands()
    }
  }, [vendorId])

  const loadBrands = async () => {
    if (!vendorId) return

    try {
      setLoading(true)
      console.log('🏢 Loading vendor brands for:', vendorId)
      const data = await brandService.getByOwnerId(vendorId)
      console.log('✅ Vendor brands loaded:', data.length)
      setBrands(data)
    } catch (err) {
      console.error('❌ Error loading vendor brands:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { brands, loading, error, refetch: loadBrands }
}
