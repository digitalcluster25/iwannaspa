export interface SpaService {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  workingHours: string;
  whatsapp?: string;
  telegram?: string;
}

export interface Spa {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  location: string;
  images: string[];
  amenities: Array<{name: string; description?: string}>; // Изменили на объекты
  services: SpaService[];
  contactInfo: ContactInfo;
  categories: Array<'wellness' | 'medical' | 'beauty' | 'thermal'>; // Мультивыбор
  purposes: Array<'relaxation' | 'health' | 'beauty' | 'detox' | 'fitness'>; // Мультивыбор
  // Старые поля для обратной совместимости
  category: 'wellness' | 'medical' | 'beauty' | 'thermal';
  purpose: 'relaxation' | 'health' | 'beauty' | 'detox' | 'fitness';
  featured: boolean;
  active: boolean;
  createdAt: string;
}

export interface SpaFilters {
  category?: string;
  purpose?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  location?: string;
}

// Reference data types
export interface City {
  id: string;
  name: string;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  value: string;
  active: boolean;
}

export interface Purpose {
  id: string;
  name: string;
  value: string;
  active: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface ServiceTemplate {
  id: string;
  name: string;
  active: boolean;
}

export interface Lead {
  id: string;
  spaId: string;
  spaName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  selectedServices: {
    id: string;
    name: string;
    price: number;
  }[];
  totalAmount: number;
  message?: string;
  status: 'new' | 'contacted' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  visitDate?: string; // Дата бронирования
}