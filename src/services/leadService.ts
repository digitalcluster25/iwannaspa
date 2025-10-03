import { supabase } from '@/lib/supabase'
import type { Lead } from '@/types/spa'

export const leadService = {
  // Получить все лиды
  async getAll() {
    const { data, error } = await supabase
      .from('leads')
      .select(
        `
        *,
        spa:spas(id, name)
      `
      )
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(this.transformLead)
  },

  // Получить по ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('leads')
      .select(
        `
        *,
        spa:spas(id, name)
      `
      )
      .eq('id', id)
      .single()

    if (error) throw error

    return this.transformLead(data)
  },

  // Создать лид
  async create(lead: Partial<Lead>) {
    const { data, error } = await supabase
      .from('leads')
      .insert({
        spa_id: lead.spaId,
        customer_name: lead.customerName,
        customer_phone: lead.customerPhone,
        customer_email: lead.customerEmail,
        selected_services: lead.selectedServices || [],
        total_amount: lead.totalAmount || 0,
        message: lead.message,
        status: lead.status || 'new',
        visit_date: lead.visitDate,
      })
      .select()
      .single()

    if (error) throw error

    return this.getById(data.id)
  },

  // Обновить лид
  async update(id: string, lead: Partial<Lead>) {
    const { error } = await supabase
      .from('leads')
      .update({
        customer_name: lead.customerName,
        customer_phone: lead.customerPhone,
        customer_email: lead.customerEmail,
        selected_services: lead.selectedServices,
        total_amount: lead.totalAmount,
        message: lead.message,
        status: lead.status,
        visit_date: lead.visitDate,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) throw error

    return this.getById(id)
  },

  // Удалить лид
  async delete(id: string) {
    const { error } = await supabase.from('leads').delete().eq('id', id)

    if (error) throw error
  },

  // Получить лиды по СПА
  async getBySpaId(spaId: string) {
    const { data, error } = await supabase
      .from('leads')
      .select(
        `
        *,
        spa:spas(id, name)
      `
      )
      .eq('spa_id', spaId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(this.transformLead)
  },

  // Получить лиды по email пользователя
  async getByUserEmail(email: string) {
    const { data, error } = await supabase
      .from('leads')
      .select(
        `
        *,
        spa:spas(id, name)
      `
      )
      .eq('customer_email', email)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(this.transformLead)
  },

  // Трансформация лида
  transformLead(data: any): Lead {
    return {
      id: data.id,
      spaId: data.spa_id,
      spaName: data.spa?.name || '',
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      customerEmail: data.customer_email,
      selectedServices: data.selected_services || [],
      totalAmount: data.total_amount,
      message: data.message,
      status: data.status,
      visitDate: data.visit_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  },
}
