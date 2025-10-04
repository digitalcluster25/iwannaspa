import { database } from '@/lib/database'
import type { Spa, SpaFilters } from '@/types/spa'

export const spaService = {
  // Получить все СПА (упрощенная версия для админки)
  async getAll() {
    console.log('🔄 Fetching spas...')
    const { data, error } = await database
      .from('spas')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching spas:', error)
      throw error
    }

    console.log('✅ Spas loaded:', data.length)
    // Трансформируем данные в нужный формат
    return this.transformSpas(data)
  },

  // Получить СПА по бренду вендора
  async getByVendorBrands(brandIds: string[]) {
    console.log('🔄 Fetching spas by vendor brands:', brandIds)
    const { data, error } = await database
      .from('spas')
      .select('*')
      .in('brand_id', brandIds)
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching spas by vendor brands:', error)
      throw error
    }

    console.log('✅ Vendor spas loaded:', data.length)
    return this.transformSpas(data)
  },

  // Получить по ID
  async getById(id: string) {
    const { data, error } = await database
      .from('spas')
      .select(
        `
        *,
        city:cities(id, name),
        services:spa_services(*),
        amenities:spa_amenities(amenity:amenities(*)),
        contact:spa_contacts(*)
      `
      )
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

    const { data: spaData, error: spaError } = await database
      .from('spas')
      .insert({
        name: spa.name,
        description: spa.description,
        price: spa.price,
        rating: spa.rating || 0,
        review_count: spa.reviewCount || 0,
        location: spa.location,
        address: spa.address,
        address_comment: spa.addressComment,
        latitude: spa.latitude,
        longitude: spa.longitude,
        images: spa.images || [],
        categories: spa.categories || (spa.category ? [spa.category] : []),
        purposes: spa.purposes || (spa.purpose ? [spa.purpose] : []),
        category: spa.category,
        purpose: spa.purpose,
        featured: spa.featured || false,
        active: spa.active !== false,
      })
      .select()
      .single()

    if (spaError) throw spaError

    // Добавляем услуги
    if (spa.services && spa.services.length > 0) {
      console.log('Saving services:', spa.services.length)
      const { error: servicesError } = await database
        .from('spa_services')
        .insert(
          spa.services.map(s => ({
            spa_id: spaData.id,
            name: s.name,
            description: s.description,
            duration: 0,
            price: s.price,
            image: s.image,
          }))
        )

      if (servicesError) throw servicesError
    }

    // Добавляем удобства
    if (spa.amenities && spa.amenities.length > 0) {
      // Получаем ID удобств по названиям
      const { data: amenitiesData, error: amenitiesSearchError } =
        await database
          .from('amenities')
          .select('id, name')
          .in('name', spa.amenities)

      if (amenitiesSearchError)
        console.error('Error searching amenities:', amenitiesSearchError)

      if (amenitiesData && amenitiesData.length > 0) {
        const insertData = amenitiesData.map(a => ({
          spa_id: spaData.id,
          amenity_id: a.id,
        }))

        const { error: amenitiesError } = await database
          .from('spa_amenities')
          .insert(insertData)

        if (amenitiesError) {
          console.error('Error inserting spa_amenities:', amenitiesError)
          throw amenitiesError
        }
      } else {
        console.warn('No amenities found in DB matching:', spa.amenities)
      }
    }

    // Добавляем контакты
    if (spa.contactInfo) {
      console.log('Saving contacts:', spa.contactInfo)

      // Сначала проверяем, существуют ли контакты (игнорируем ошибку если нет)
      const { data: existingContact, error: checkError } = await database
        .from('spa_contacts')
        .select('id')
        .eq('spa_id', spaData.id)
        .maybeSingle() // maybeSingle() вместо single() - не выдает ошибку если нет записи

      console.log('Existing contact check:', {
        exists: !!existingContact,
        checkError,
      })

      if (existingContact) {
        console.log('Updating existing contact')
        // Обновляем существующие
        const { error: contactError } = await database
          .from('spa_contacts')
          .update({
            phone: spa.contactInfo.phone,
            email: spa.contactInfo.email,
            working_hours: spa.contactInfo.workingHours,
            whatsapp: spa.contactInfo.whatsapp,
            telegram: spa.contactInfo.telegram,
          })
          .eq('spa_id', spaData.id)

        if (contactError) {
          console.error('Error updating contact:', contactError)
          throw contactError
        }
      } else {
        console.log('Creating new contact')
        // Создаем новые
        const { error: contactError } = await database
          .from('spa_contacts')
          .insert({
            spa_id: spaData.id,
            phone: spa.contactInfo.phone,
            email: spa.contactInfo.email,
            working_hours: spa.contactInfo.workingHours,
            whatsapp: spa.contactInfo.whatsapp,
            telegram: spa.contactInfo.telegram,
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
    const { error } = await database
      .from('spas')
      .update({
        name: spa.name,
        description: spa.description,
        price: spa.price,
        rating: spa.rating,
        review_count: spa.reviewCount,
        location: spa.location,
        address: spa.address,
        address_comment: spa.addressComment,
        latitude: spa.latitude,
        longitude: spa.longitude,
        images: spa.images,
        categories: spa.categories || (spa.category ? [spa.category] : []),
        purposes: spa.purposes || (spa.purpose ? [spa.purpose] : []),
        category: spa.category,
        purpose: spa.purpose,
        featured: spa.featured,
        active: spa.active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) throw error

    // Обновляем услуги
    if (spa.services) {
      // Удаляем старые услуги
      await database.from('spa_services').delete().eq('spa_id', id)

      // Добавляем новые
      if (spa.services.length > 0) {
        await database.from('spa_services').insert(
          spa.services.map(s => ({
            spa_id: id,
            name: s.name,
            description: s.description,
            duration: 0,
            price: s.price,
            image: s.image,
          }))
        )
      }
    }

    // Обновляем удобства
    if (spa.amenities) {
      // Удаляем старые удобства
      const { error: deleteError } = await database
        .from('spa_amenities')
        .delete()
        .eq('spa_id', id)
      if (deleteError)
        console.error('Error deleting old amenities:', deleteError)

      // Добавляем новые
      if (spa.amenities.length > 0) {
        const { data: amenitiesData, error: searchError } = await database
          .from('amenities')
          .select('id, name')
          .in('name', spa.amenities)

        if (searchError)
          console.error('Error searching amenities:', searchError)

        if (amenitiesData && amenitiesData.length > 0) {
          const insertData = amenitiesData.map(a => ({
            spa_id: id,
            amenity_id: a.id,
          }))

          const { error: insertError } = await database
            .from('spa_amenities')
            .insert(insertData)
          if (insertError)
            console.error('Error inserting amenities:', insertError)
        } else {
          console.warn('No amenities found in DB matching:', spa.amenities)
        }
      }
    }

    // Обновляем контакты
    if (spa.contactInfo) {
      await database.from('spa_contacts').upsert({
        spa_id: id,
        phone: spa.contactInfo.phone,
        email: spa.contactInfo.email,
        working_hours: spa.contactInfo.workingHours,
        whatsapp: spa.contactInfo.whatsapp,
        telegram: spa.contactInfo.telegram,
      })
    }

    return this.getById(id)
  },

  // Удалить
  async delete(id: string) {
    const { error } = await database.from('spas').delete().eq('id', id)

    if (error) throw error
  },

  // Поиск с фильтрами
  async search(
    filters: SpaFilters & { searchTerm?: string; amenities?: string[] }
  ) {
    console.log('🔍 spaService.search called with filters:', filters)
    console.log('🔍 spaService using database client:', database)

    // Проверяем, используем ли мы Railway API или Supabase
    const isRailwayAPI = typeof database.from === 'function' && 
                        typeof database.from('spas').search === 'function'

    if (isRailwayAPI) {
      console.log('🚂 Using Railway API syntax')
      
      // Для Railway API используем упрощенный подход
      if (filters.featured !== undefined) {
        console.log('🔍 Searching for featured spas:', filters.featured)
        
        const result = await database
          .from('spas')
          .search({
            featured: filters.featured,
            active: true
          })

        console.log('✅ Featured spas found:', result?.length || 0)
        return this.transformSpas(result || [])
      }

      // Для других фильтров используем базовый запрос
      const result = await database
        .from('spas')
        .search({
          active: true
        })

      console.log('✅ All spas found:', result?.length || 0)
      return this.transformSpas(result || [])
    } else {
      console.log('☁️ Using Supabase syntax')
      
      // Для Supabase используем стандартный синтаксис
      if (filters.featured !== undefined) {
        console.log('🔍 Searching for featured spas:', filters.featured)
        
        const { data, error } = await database
          .from('spas')
          .select('*')
          .eq('active', true)
          .eq('featured', filters.featured)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('❌ Error searching featured spas:', error)
          throw error
        }

        console.log('✅ Featured spas found:', data?.length || 0)
        return this.transformSpas(data || [])
      }

      // Для других фильтров используем базовый запрос
      const { data, error } = await database
        .from('spas')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error searching spas:', error)
        throw error
      }

      console.log('✅ All spas found:', data?.length || 0)
      return this.transformSpas(data || [])
    }
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
      address: data.address,
      addressComment: data.address_comment,
      latitude: data.latitude,
      longitude: data.longitude,
      images: data.images || [],
      amenities: data.amenities
        ?.map((a: any) => ({
          name: a.amenity?.name,
          description: a.amenity?.description,
        }))
        .filter((a: any) => a.name) || [],
      services: data.services?.map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description || '',
        price: s.price,
        image: s.image || '',
      })) || [],
      contactInfo: data.contact
        ? {
            phone: data.contact.phone || '',
            email: data.contact.email || '',
            workingHours: data.contact.working_hours || '',
            whatsapp: data.contact.whatsapp,
            telegram: data.contact.telegram,
          }
        : {
            phone: '',
            email: '',
            workingHours: '',
          },
      categories: data.categories || (data.category ? [data.category] : []),
      purposes: data.purposes || (data.purpose ? [data.purpose] : []),
      category: data.category as any,
      purpose: data.purpose as any,
      featured: data.featured,
      active: data.active,
      createdAt: data.created_at,
    }
  },

  // Трансформация массива СПА
  transformSpas(data: any[]): Spa[] {
    return data.map(item => this.transformSpa(item))
  },
}
