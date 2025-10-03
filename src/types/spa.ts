export interface SpaService {
  id: string
  name: string
  description: string
  price: number
  image: string
}

export interface ContactInfo {
  phone: string
  email: string
  workingHours: string
  whatsapp?: string
  telegram?: string
}

// Brand interface
export interface Brand {
  id: string
  name: string
  description: string | null
  logo: string | null
  active: boolean
  owner_id: string | null
  created_at: string
  updated_at: string
  owner?: UserProfile // Загружается при необходимости
}

// User Profile interface
export interface UserProfile {
  id: string
  name: string | null
  phone: string | null
  role: 'admin' | 'vendor' | 'user'
  active: boolean // Активирован ли вендор
  created_at: string
  updated_at: string
}

export interface Spa {
  id: string
  name: string
  description: string
  price: number
  rating: number
  reviewCount: number
  location: string
  address?: string // Полный адрес
  addressComment?: string // Комментарий к адресу
  latitude?: number // Координаты для карты
  longitude?: number // Координаты для карты
  images: string[]
  amenities: Array<{ name: string; description?: string }> // Изменили на объекты
  services: SpaService[]
  contactInfo: ContactInfo
  categories: Array<'wellness' | 'medical' | 'beauty' | 'thermal'> // Мультивыбор
  purposes: Array<'relaxation' | 'health' | 'beauty' | 'detox' | 'fitness'> // Мультивыбор
  // Старые поля для обратной совместимости
  category: 'wellness' | 'medical' | 'beauty' | 'thermal'
  purpose: 'relaxation' | 'health' | 'beauty' | 'detox' | 'fitness'
  featured: boolean
  active: boolean
  createdAt: string
  city?: City // Связь с городом
  brand_id?: string // Привязка к бренду
  brand?: Brand // Загружается при необходимости
}

export interface SpaFilters {
  category?: string
  purpose?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  location?: string
  country?: string
  featured?: boolean
}

// Reference data types
export interface Country {
  id: string
  name: string
  code: string
  active: boolean
}

export interface City {
  id: string
  name: string
  countryId?: string
  country?: Country
  district?: string // Район города
  active: boolean
}

export interface Category {
  id: string
  name: string
  value: string
  active: boolean
}

export interface Purpose {
  id: string
  name: string
  value: string
  active: boolean
}

export interface Amenity {
  id: string
  name: string
  description?: string
  active: boolean
}

// SPA Amenity - кастомное описание удобства для конкретного СПА
export interface SpaAmenity {
  id: string
  spa_id: string
  amenity_id: string
  custom_description: string | null
  created_at: string
  updated_at: string
  amenity?: Amenity // Загружается при необходимости
}

export interface ServiceTemplate {
  id: string
  name: string
  active: boolean
}

export interface Lead {
  id: string
  spaId: string
  spaName: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  selectedServices: {
    id: string
    name: string
    price: number
  }[]
  totalAmount: number
  message?: string
  status: 'new' | 'contacted' | 'confirmed' | 'cancelled'
  createdAt: string
  updatedAt: string
  visitDate?: string // Дата бронирования
}
