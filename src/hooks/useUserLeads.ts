import { useState, useEffect } from 'react'
import { leadService } from '@/services/leadService'
import type { Lead } from '@/types/spa'

export function useUserLeads(email: string | undefined) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!email) {
      setLeads([])
      setLoading(false)
      return
    }

    const fetchLeads = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await leadService.getByUserEmail(email)
        setLeads(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [email])

  const refresh = async () => {
    if (!email) return
    setLoading(true)
    try {
      const data = await leadService.getByUserEmail(email)
      setLeads(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { leads, loading, error, refresh }
}
