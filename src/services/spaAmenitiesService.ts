import { database as supabase } from '@/lib/database'

export interface SpaAmenity {
  spa_id: string
  amenity_id: string
  custom_description?: string
  created_at?: string
}

export interface SpaAmenityWithDetails extends SpaAmenity {
  amenity?: {
    id: string
    name: string
    icon?: string
    description?: string
  }
}

export const spaAmenitiesService = {
  // Получить все удобства для СПА
  async getBySpaId(spaId: string): Promise<SpaAmenityWithDetails[]> {
    const { data, error } = await supabase
      .from('spa_amenities')
      .select(`
        *,
        amenity:amenities(
          id,
          name,
          icon,
          description
        )
      `)
      .eq('spa_id', spaId)
      .order('spa_id', { ascending: true })

    if (error) {
      console.error('Error fetching spa amenities:', error)
      throw error
    }

    return data || []
  },

  // Добавить удобство к СПА
  async addAmenity(spaId: string, amenityId: string, customDescription?: string): Promise<SpaAmenity> {
    const { data, error } = await supabase
      .from('spa_amenities')
      .insert({
        spa_id: spaId,
        amenity_id: amenityId,
        custom_description: customDescription
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding spa amenity:', error)
      throw error
    }

    return data
  },

  // Обновить описание удобства
  async updateAmenity(spaId: string, amenityId: string, customDescription?: string): Promise<SpaAmenity> {
    const { data, error } = await supabase
      .from('spa_amenities')
      .update({
        custom_description: customDescription
      })
      .eq('spa_id', spaId)
      .eq('amenity_id', amenityId)
      .select()
      .single()

    if (error) {
      console.error('Error updating spa amenity:', error)
      throw error
    }

    return data
  },

  // Удалить удобство из СПА
  async removeAmenity(spaId: string, amenityId: string): Promise<void> {
    const { error } = await supabase
      .from('spa_amenities')
      .delete()
      .eq('spa_id', spaId)
      .eq('amenity_id', amenityId)

    if (error) {
      console.error('Error removing spa amenity:', error)
      throw error
    }
  },

  // Получить все доступные удобства (которые еще не добавлены к СПА)
  async getAvailableAmenities(spaId: string) {
    // Сначала получаем все удобства
    const { data: allAmenities, error: amenitiesError } = await supabase
      .from('amenities')
      .select('*')
      .order('name')

    if (amenitiesError) {
      console.error('Error fetching amenities:', amenitiesError)
      throw amenitiesError
    }

    // Затем получаем уже добавленные удобства для этого СПА
    const { data: spaAmenities, error: spaAmenitiesError } = await supabase
      .from('spa_amenities')
      .select('amenity_id')
      .eq('spa_id', spaId)

    if (spaAmenitiesError) {
      console.error('Error fetching spa amenities:', spaAmenitiesError)
      throw spaAmenitiesError
    }

    // Фильтруем доступные удобства
    const addedAmenityIds = new Set(spaAmenities?.map(sa => sa.amenity_id) || [])
    const availableAmenities = allAmenities?.filter(amenity => !addedAmenityIds.has(amenity.id)) || []

    return availableAmenities
  }
}
