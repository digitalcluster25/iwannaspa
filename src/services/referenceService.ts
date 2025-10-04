import { database as supabase } from '@/lib/database'
import type {
  City,
  Category,
  Purpose,
  Amenity,
  ServiceTemplate,
  Country,
} from '@/types/spa'

// Сервис для работы со странами
export const countryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name')

    if (error) throw error
    return data as Country[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Country
  },

  async create(country: { name: string; code: string; active?: boolean }) {
    const { data, error } = await supabase
      .from('countries')
      .insert(country)
      .select()
      .single()

    if (error) throw error
    return data as Country
  },

  async update(id: string, country: Partial<Country>) {
    const { data, error } = await supabase
      .from('countries')
      .update(country)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Country
  },

  async delete(id: string) {
    const { error } = await supabase.from('countries').delete().eq('id', id)

    if (error) throw error
  },
}

// Сервис для работы с городами
export const cityService = {
  async getAll() {
    const { data, error } = await supabase
      .from('cities')
      .select(`
        *,
        country:countries(*)
      `)
      .order('name')

    if (error) throw error
    
    // Преобразуем country_id в countryId для фронтенда
    return data.map(city => ({
      ...city,
      countryId: city.country_id,
    })) as City[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as City
  },

  async create(city: { name: string; countryId?: string; active?: boolean }) {
    const cityData = {
      name: city.name,
      country_id: city.countryId,
      active: city.active,
    }
    
    const { data, error } = await supabase
      .from('cities')
      .insert(cityData)
      .select()
      .single()

    if (error) throw error
    return data as City
  },

  async update(id: string, city: Partial<City>) {
    const cityData: any = { ...city }
    
    // Преобразуем countryId в country_id для базы данных
    if (cityData.countryId !== undefined) {
      cityData.country_id = cityData.countryId
      delete cityData.countryId
    }
    
    const { data, error } = await supabase
      .from('cities')
      .update(cityData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as City
  },

  async delete(id: string) {
    const { error } = await supabase.from('cities').delete().eq('id', id)

    if (error) throw error
  },
}

// Сервис для работы с категориями
export const categoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data as Category[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Category
  },

  async create(category: {
    name: string
    label: string
    value: string
    active?: boolean
  }) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single()

    if (error) throw error
    return data as Category
  },

  async update(id: string, category: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Category
  },

  async delete(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) throw error
  },
}

// Сервис для работы с назначениями (purposes)
export const purposeService = {
  async getAll() {
    const { data, error } = await supabase
      .from('purposes')
      .select('*')
      .order('name')

    if (error) throw error
    return data as Purpose[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('purposes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Purpose
  },

  async create(purpose: {
    name: string
    label: string
    value: string
    active?: boolean
  }) {
    const { data, error } = await supabase
      .from('purposes')
      .insert(purpose)
      .select()
      .single()

    if (error) throw error
    return data as Purpose
  },

  async update(id: string, purpose: Partial<Purpose>) {
    const { data, error } = await supabase
      .from('purposes')
      .update(purpose)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Purpose
  },

  async delete(id: string) {
    const { error } = await supabase.from('purposes').delete().eq('id', id)

    if (error) throw error
  },
}

// Сервис для работы с удобствами (amenities)
export const amenityService = {
  async getAll() {
    const { data, error } = await supabase
      .from('amenities')
      .select('*')
      .order('name')

    if (error) throw error
    return data as Amenity[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('amenities')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Amenity
  },

  async create(amenity: { name: string; description?: string; active?: boolean }) {
    const { data, error } = await supabase
      .from('amenities')
      .insert(amenity)
      .select()
      .single()

    if (error) throw error
    return data as Amenity
  },

  async update(id: string, amenity: Partial<Amenity>) {
    const { data, error } = await supabase
      .from('amenities')
      .update(amenity)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Amenity
  },

  async delete(id: string) {
    const { error } = await supabase.from('amenities').delete().eq('id', id)

    if (error) throw error
  },
}

// Сервис для работы с шаблонами услуг
export const serviceTemplateService = {
  async getAll() {
    const { data, error } = await supabase
      .from('service_templates')
      .select('*')
      .order('name')

    if (error) throw error
    return data as ServiceTemplate[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('service_templates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as ServiceTemplate
  },

  async create(service: { name: string; active?: boolean }) {
    const { data, error } = await supabase
      .from('service_templates')
      .insert(service)
      .select()
      .single()

    if (error) throw error
    return data as ServiceTemplate
  },

  async update(id: string, service: Partial<ServiceTemplate>) {
    const { data, error } = await supabase
      .from('service_templates')
      .update(service)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as ServiceTemplate
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('service_templates')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}
