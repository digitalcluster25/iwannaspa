import { database as supabase } from '@/lib/database'
import type { Brand } from '@/types/spa'

export const brandService = {
  async getAll() {
    const { data, error } = await supabase
      .from('brands')
      .select(`
        *,
        owner:profiles(id, name, phone, role)
      `)
      .order('name')

    if (error) throw error
    return data as Brand[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('brands')
      .select(`
        *,
        owner:profiles(id, name, phone, role)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Brand
  },

  async getByOwnerId(ownerId: string) {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('owner_id', ownerId)
      .order('name')

    if (error) throw error
    return data as Brand[]
  },

  async create(brand: {
    name: string
    description?: string
    logo?: string
    active?: boolean
    owner_id?: string
  }) {
    const { data, error } = await supabase
      .from('brands')
      .insert(brand)
      .select()
      .single()

    if (error) throw error
    return data as Brand
  },

  async update(id: string, brand: Partial<Brand>) {
    const { data, error } = await supabase
      .from('brands')
      .update(brand)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Brand
  },

  async delete(id: string) {
    const { error } = await supabase.from('brands').delete().eq('id', id)

    if (error) throw error
  },
}

// Сервис для работы с SpaAmenities (кастомные описания удобств)
export const spaAmenityService = {
  async getBySpaId(spaId: string) {
    const { data, error } = await supabase
      .from('spa_amenities')
      .select(`
        *,
        amenity:amenities(id, name, description, active)
      `)
      .eq('spa_id', spaId)

    if (error) throw error
    return data
  },

  async create(spaAmenity: {
    spa_id: string
    amenity_id: string
    custom_description?: string
  }) {
    const { data, error } = await supabase
      .from('spa_amenities')
      .insert(spaAmenity)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(
    id: string,
    spaAmenity: {
      custom_description?: string
    }
  ) {
    const { data, error } = await supabase
      .from('spa_amenities')
      .update(spaAmenity)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabase.from('spa_amenities').delete().eq('id', id)

    if (error) throw error
  },

  async deleteByAmenityId(spaId: string, amenityId: string) {
    const { error } = await supabase
      .from('spa_amenities')
      .delete()
      .eq('spa_id', spaId)
      .eq('amenity_id', amenityId)

    if (error) throw error
  },
}
