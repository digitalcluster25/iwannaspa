import { supabase } from '@/lib/supabase'
import type { Spa, SpaFilters } from '@/types/spa'

export const spaService = {
  // Получить все СПА
  async getAll() {
    const { data, error } = await supabase
      .from('spas')
      .select(`
        *,
        city:cities(id, name),
        services:spa_services(*),
        amenities:spa_amenities(amenity:amenities(*)),
        contact:spa_contacts(*)
      `)
      .eq('active', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching spas:', error)
      throw error
    }
    
    // Трансформируем данные в нужный формат
    return this.transformSpas(data)
  },

  // Получить по ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('spas')
      .select(`
        *,
        city:cities(id, name),
        services:spa_services(*),
        amenities:spa_amenities(amenity:amenities(*)),
        contact:spa_contacts(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching spa:', error)
      throw error
    }
    
    return this.transformSpa(data)
  },

  // Создать СПА
  async create(spa: Partial<Spa>) {
    console.log('Creating SPA with data:', spa)
    
    const { data: spaData, error: spaError } = await supabase
      .from('spas')
      .insert({
        name: spa.name,
        description: spa.description,
        price: spa.price,
        rating: spa.rating || 0,
        review_count: spa.reviewCount || 0,
        location: spa.location,
        images: spa.images || [],
        categories: spa.categories || (spa.category ? [spa.category] : []),
        purposes: spa.purposes || (spa.purpose ? [spa.purpose] : []),
        category: spa.category,
        purpose: spa.purpose,
        featured: spa.featured || false,
        active: spa.active !== false
      })
      .select()
      .single()
    
    if (spaError) throw spaError

    // Добавляем услуги
    if (spa.services && spa.services.length > 0) {
      console.log('Saving services:', spa.services.length)
      const { error: servicesError } = await supabase
        .from('spa_services')
        .insert(
          spa.services.map(s => ({
            spa_id: spaData.id,
            name: s.name,
            description: s.description,
            duration: 0,
            price: s.price,
            image: s.image
          }))
        )
      
      if (servicesError) throw servicesError
    }

    // Добавляем удобства
    if (spa.amenities && spa.amenities.length > 0) {
      console.log('Saving amenities:', spa.amenities)
      // Получаем ID удобств по названиям
      const { data: amenitiesData } = await supabase
        .from('amenities')
        .select('id, name')
        .in('name', spa.amenities)
      
      if (amenitiesData && amenitiesData.length > 0) {
        const { error: amenitiesError } = await supabase
          .from('spa_amenities')
          .insert(
            amenitiesData.map(a => ({
              spa_id: spaData.id,
              amenity_id: a.id
            }))
          )
        
        if (amenitiesError) throw amenitiesError
      }
    }

    // Добавляем контакты
    if (spa.contactInfo) {
      console.log('Saving contacts:', spa.contactInfo)
      
      // Сначала проверяем, существуют ли контакты (игнорируем ошибку если нет)
      const { data: existingContact, error: checkError } = await supabase
        .from('spa_contacts')
        .select('id')
        .eq('spa_id', spaData.id)
        .maybeSingle() // maybeSingle() вместо single() - не выдает ошибку если нет записи
      
      console.log('Existing contact check:', { exists: !!existingContact, checkError })
      
      if (existingContact) {
        console.log('Updating existing contact')
        // Обновляем существующие
        const { error: contactError } = await supabase
          .from('spa_contacts')
          .update({
            phone: spa.contactInfo.phone,
            email: spa.contactInfo.email,
            working_hours: spa.contactInfo.workingHours,
            whatsapp: spa.contactInfo.whatsapp,
            telegram: spa.contactInfo.telegram
          })
          .eq('spa_id', spaData.id)
        
        if (contactError) {
          console.error('Error updating contact:', contactError)
          throw contactError
        }
      } else {
        console.log('Creating new contact')
        // Создаем новые
        const { error: contactError } = await supabase
          .from('spa_contacts')
          .insert({
            spa_id: spaData.id,
            phone: spa.contactInfo.phone,
            email: spa.contactInfo.email,
            working_hours: spa.contactInfo.workingHours,
            whatsapp: spa.contactInfo.whatsapp,
            telegram: spa.contactInfo.telegram
          })
        
        if (contactError) {
          console.error('Error creating contact:', contactError)
          throw contactError
        }
      }
    }

    return this.getById(spaData.id)
  },

  // Обновить
  async update(id: string, spa: Partial<Spa>) {
    const { error } = await supabase
      .from('spas')
      .update({
        name: spa.name,
        description: spa.description,
        price: spa.price,
        rating: spa.rating,
        review_count: spa.reviewCount,
        location: spa.location,
        images: spa.images,
        categories: spa.categories || (spa.category ? [spa.category] : []),
        purposes: spa.purposes || (spa.purpose ? [spa.purpose] : []),
        category: spa.category,
        purpose: spa.purpose,
        featured: spa.featured,
        active: spa.active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) throw error

    // Обновляем услуги
    if (spa.services) {
      // Удаляем старые услуги
      await supabase.from('spa_services').delete().eq('spa_id', id)
      
      // Добавляем новые
      if (spa.services.length > 0) {
        await supabase.from('spa_services').insert(
          spa.services.map(s => ({
            spa_id: id,
            name: s.name,
            description: s.description,
            duration: 0,
            price: s.price,
            image: s.image
          }))
        )
      }
    }

    // Обновляем удобства
    if (spa.amenities) {
      // Удаляем старые удобства
      await supabase.from('spa_amenities').delete().eq('spa_id', id)
      
      // Добавляем новые
      if (spa.amenities.length > 0) {
        const { data: amenitiesData } = await supabase
          .from('amenities')
          .select('id, name')
          .in('name', spa.amenities)
        
        if (amenitiesData && amenitiesData.length > 0) {
          await supabase.from('spa_amenities').insert(
            amenitiesData.map(a => ({
              spa_id: id,
              amenity_id: a.id
            }))
          )
        }
      }
    }

    // Обновляем контакты
    if (spa.contactInfo) {
      await supabase
        .from('spa_contacts')
        .upsert({
          spa_id: id,
          phone: spa.contactInfo.phone,
          email: spa.contactInfo.email,
          working_hours: spa.contactInfo.workingHours,
          whatsapp: spa.contactInfo.whatsapp,
          telegram: spa.contactInfo.telegram
        })
    }

    return this.getById(id)
  },

  // Удалить
  async delete(id: string) {
    const { error } = await supabase
      .from('spas')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Поиск с фильтрами
  async search(filters: SpaFilters & { searchTerm?: string; amenities?: string[] }) {
    let query = supabase
      .from('spas')
      .select(`
        *,
        city:cities(id, name),
        services:spa_services(*),
        amenities:spa_amenities(amenity:amenities(*)),
        contact:spa_contacts(*)
      `)
      .eq('active', true)

    if (filters.searchTerm) {
      query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`)
    }
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    if (filters.purpose) {
      query = query.eq('purpose', filters.purpose)
    }
    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice)
    }
    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice)
    }
    if (filters.minRating !== undefined) {
      query = query.gte('rating', filters.minRating)
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    
    return this.transformSpas(data)
  },

  // Трансформация одного СПА
  transformSpa(data: any): Spa {
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: data.price || 0,
      rating: data.rating || 0,
      reviewCount: data.review_count || 0,
      location: data.location || '',
      images: data.images || [],
      amenities: data.amenities?.map((a: any) => ({
        name: a.amenity?.name,
        description: a.amenity?.description
      })).filter((a: any) => a.name) || [],
      services: data.services?.map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description || '',
        price: s.price,
        image: s.image || ''
      })) || [],
      contactInfo: data.contact ? {
        phone: data.contact.phone || '',
        email: data.contact.email || '',
        workingHours: data.contact.working_hours || '',
        whatsapp: data.contact.whatsapp,
        telegram: data.contact.telegram
      } : {
        phone: '',
        email: '',
        workingHours: ''
      },
      category: data.category as any,
      purpose: data.purpose as any,
      featured: data.featured,
      active: data.active,
      createdAt: data.created_at
    }
  },

  // Трансформация массива СПА
  transformSpas(data: any[]): Spa[] {
    return data.map(item => this.transformSpa(item))
  }
}
