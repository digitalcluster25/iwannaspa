export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cities: {
        Row: {
          id: string
          name: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          active?: boolean
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          label: string
          value: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          label: string
          value: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          label?: string
          value?: string
          active?: boolean
          created_at?: string
        }
      }
      purposes: {
        Row: {
          id: string
          name: string
          label: string
          value: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          label: string
          value: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          label?: string
          value?: string
          active?: boolean
          created_at?: string
        }
      }
      amenities: {
        Row: {
          id: string
          name: string
          icon: string | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon?: string | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          active?: boolean
          created_at?: string
        }
      }
      service_templates: {
        Row: {
          id: string
          name: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          active?: boolean
          created_at?: string
        }
      }
      spas: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number | null
          rating: number
          review_count: number
          location: string | null
          city_id: string | null
          images: string[]
          category: string | null
          purpose: string | null
          featured: boolean
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price?: number | null
          rating?: number
          review_count?: number
          location?: string | null
          city_id?: string | null
          images?: string[]
          category?: string | null
          purpose?: string | null
          featured?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number | null
          rating?: number
          review_count?: number
          location?: string | null
          city_id?: string | null
          images?: string[]
          category?: string | null
          purpose?: string | null
          featured?: boolean
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      spa_services: {
        Row: {
          id: string
          spa_id: string
          name: string
          description: string | null
          duration: number | null
          price: number
          image: string | null
          created_at: string
        }
        Insert: {
          id?: string
          spa_id: string
          name: string
          description?: string | null
          duration?: number | null
          price: number
          image?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          spa_id?: string
          name?: string
          description?: string | null
          duration?: number | null
          price?: number
          image?: string | null
          created_at?: string
        }
      }
      spa_amenities: {
        Row: {
          spa_id: string
          amenity_id: string
        }
        Insert: {
          spa_id: string
          amenity_id: string
        }
        Update: {
          spa_id?: string
          amenity_id?: string
        }
      }
      spa_contacts: {
        Row: {
          id: string
          spa_id: string
          phone: string | null
          email: string | null
          working_hours: string | null
          whatsapp: string | null
          telegram: string | null
          website: string | null
          created_at: string
        }
        Insert: {
          id?: string
          spa_id: string
          phone?: string | null
          email?: string | null
          working_hours?: string | null
          whatsapp?: string | null
          telegram?: string | null
          website?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          spa_id?: string
          phone?: string | null
          email?: string | null
          working_hours?: string | null
          whatsapp?: string | null
          telegram?: string | null
          website?: string | null
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          spa_id: string
          customer_name: string
          customer_phone: string
          customer_email: string | null
          selected_services: Json
          total_amount: number
          message: string | null
          status: string
          visit_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          spa_id: string
          customer_name: string
          customer_phone: string
          customer_email?: string | null
          selected_services: Json
          total_amount: number
          message?: string | null
          status?: string
          visit_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          spa_id?: string
          customer_name?: string
          customer_phone?: string
          customer_email?: string | null
          selected_services?: Json
          total_amount?: number
          message?: string | null
          status?: string
          visit_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
