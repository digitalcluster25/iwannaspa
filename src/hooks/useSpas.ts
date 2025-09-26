import { useState, useEffect } from 'react'
import { spaService } from '@/services/spaService'
import type { Spa, SpaFilters } from '@/types/spa'

export function useSpas() {
  const [spas, setSpas] = useState<Spa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadSpas()
  }, [])

  const loadSpas = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Loading spas from Supabase...')
      const data = await spaService.getAll()
      console.log('✅ Spas loaded:', data.length)
      setSpas(data)
    } catch (err) {
      console.error('❌ Error loading spas:', err)
      setError(err as Error)
      console.error('Error loading spas:', err)
    } finally {
      setLoading(false)
    }
  }

  return { spas, loading, error, refetch: loadSpas }
}

export function useSpa(id: string | undefined) {
  const [spa, setSpa] = useState<Spa | null>(null)
  const [loading, setLoading] = useState(!!id) // Только true если есть id
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (id) {
      loadSpa()
    }
  }, [id])

  const loadSpa = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await spaService.getById(id)
      setSpa(data)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading spa:', err)
    } finally {
      setLoading(false)
    }
  }

  return { spa, loading, error, refetch: loadSpa }
}

export function useSpaSearch(filters: SpaFilters & { searchTerm?: string }) {
  const [spas, setSpas] = useState<Spa[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    search()
  }, [JSON.stringify(filters)])

  const search = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await spaService.search(filters)
      setSpas(data)
    } catch (err) {
      setError(err as Error)
      console.error('Error searching spas:', err)
    } finally {
      setLoading(false)
    }
  }

  return { spas, loading, error, refetch: search }
}

export function useSpaActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createSpa = async (spa: Partial<Spa>) => {
    try {
      setLoading(true)
      setError(null)
      const data = await spaService.create(spa)
      return data
    } catch (err) {
      setError(err as Error)
      console.error('Error creating spa:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateSpa = async (id: string, spa: Partial<Spa>) => {
    try {
      setLoading(true)
      setError(null)
      const data = await spaService.update(id, spa)
      return data
    } catch (err) {
      setError(err as Error)
      console.error('Error updating spa:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteSpa = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await spaService.delete(id)
    } catch (err) {
      setError(err as Error)
      console.error('Error deleting spa:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createSpa, updateSpa, deleteSpa, loading, error }
}
