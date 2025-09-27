import { useState, useEffect } from 'react'
import { leadService } from '@/services/leadService'
import type { Lead } from '@/types/spa'

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await leadService.getAll()
      setLeads(data)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading leads:', err)
    } finally {
      setLoading(false)
    }
  }

  return { leads, loading, error, refetch: loadLeads }
}

export function useLead(id: string | undefined) {
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (id) {
      loadLead()
    }
  }, [id])

  const loadLead = async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      const data = await leadService.getById(id)
      setLead(data)
    } catch (err) {
      setError(err as Error)
      console.error('Error loading lead:', err)
    } finally {
      setLoading(false)
    }
  }

  return { lead, loading, error, refetch: loadLead }
}

export function useLeadActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createLead = async (lead: Partial<Lead>) => {
    try {
      setLoading(true)
      setError(null)
      const data = await leadService.create(lead)
      return data
    } catch (err) {
      setError(err as Error)
      console.error('Error creating lead:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateLead = async (id: string, lead: Partial<Lead>) => {
    try {
      setLoading(true)
      setError(null)
      const data = await leadService.update(id, lead)
      return data
    } catch (err) {
      setError(err as Error)
      console.error('Error updating lead:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteLead = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await leadService.delete(id)
    } catch (err) {
      setError(err as Error)
      console.error('Error deleting lead:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createLead, updateLead, deleteLead, loading, error }
}
