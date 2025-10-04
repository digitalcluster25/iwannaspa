// Railway PostgreSQL + PostgREST конфигурация
// Замена Supabase на Railway

const RAILWAY_POSTGREST_URL = import.meta.env.VITE_RAILWAY_POSTGREST_URL || 'https://postgrestpostgrest-production-44bc.up.railway.app'

console.log('🚂 Using Railway PostgreSQL + PostgREST')

// Простой клиент для Railway PostgREST API
export class RailwayClient {
  private baseUrl: string
  private headers: HeadersInit

  constructor(baseUrl: string = RAILWAY_POSTGREST_URL) {
    this.baseUrl = baseUrl
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  // GET запрос
  async get(table: string, options: { 
    select?: string
    eq?: Record<string, any>
    order?: string
    limit?: number
    [key: string]: any // Поддержка дополнительных параметров
  } = {}) {
    const url = new URL(`${this.baseUrl}/${table}`)
    
    if (options.select) {
      url.searchParams.set('select', options.select)
    }
    
    if (options.eq) {
      Object.entries(options.eq).forEach(([key, value]) => {
        url.searchParams.set(key, `eq.${value}`)
      })
    }
    
    if (options.order) {
      url.searchParams.set('order', options.order)
    }
    
    if (options.limit) {
      url.searchParams.set('limit', options.limit.toString())
    }
    
    // Добавляем все дополнительные параметры
    Object.keys(options).forEach(key => {
      if (!['select', 'eq', 'order', 'limit'].includes(key)) {
        url.searchParams.set(key, options[key])
      }
    })

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // POST запрос
  async post(table: string, data: any) {
    const response = await fetch(`${this.baseUrl}/${table}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // PUT запрос
  async put(table: string, data: any, id: string) {
    const response = await fetch(`${this.baseUrl}/${table}?id=eq.${id}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // DELETE запрос
  async delete(table: string, id: string) {
    const response = await fetch(`${this.baseUrl}/${table}?id=eq.${id}`, {
      method: 'DELETE',
      headers: this.headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }
}

// Экспортируем экземпляр клиента
export const railway = new RailwayClient()

// Функции для совместимости с Supabase API
export const railwaySupabase = {
  auth: {
    admin: {
      getUserById: async (userId: string) => {
        // Для Railway просто возвращаем заглушку
        // В реальном приложении нужно будет получить email из базы данных
        const result = await railway.get('profiles', {
          select: 'id,name',
          eq: { id: userId }
        })
        
        return {
          data: {
            user: result[0] ? {
              id: userId,
              email: 'user@example.com' // Заглушка
            } : null
          }
        }
      },
      createUser: async (userData: {
        email: string
        password: string
        email_confirm?: boolean
        user_metadata?: { name?: string }
      }) => {
        // Для Railway создаем профиль напрямую в базе данных
        // Генерируем UUID для пользователя
        const userId = crypto.randomUUID()
        
        const profileData = {
          id: userId,
          name: userData.user_metadata?.name || userData.email.split('@')[0],
          role: 'user',
          active: true,
          phone: null
        }
        
        // Создаем профиль в базе данных
        const result = await railway.post('profiles', profileData)
        
        return {
          data: {
            user: {
              id: userId,
              email: userData.email,
              user_metadata: userData.user_metadata
            }
          },
          error: null
        }
      }
    }
  },
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        order: (column: string, options?: { ascending?: boolean }) => ({
          single: async () => {
            const result = await railway.get(table, {
              select: columns,
              eq: { [column]: value },
              order: options?.ascending === false ? `${column}.desc` : `${column}.asc`
            })
            return { data: result[0] || null, error: null }
          },
          then: async (callback: (result: any) => void) => {
            const result = await railway.get(table, {
              select: columns,
              eq: { [column]: value },
              order: options?.ascending === false ? `${column}.desc` : `${column}.asc`
            })
            callback({ data: result, error: null })
          }
        }),
        single: async () => {
          const result = await railway.get(table, {
            select: columns,
            eq: { [column]: value }
          })
          return { data: result[0] || null, error: null }
        },
        then: async (callback: (result: any) => void) => {
          const result = await railway.get(table, {
            select: columns,
            eq: { [column]: value }
          })
          callback({ data: result, error: null })
        }
      }),
      order: (column: string, options?: { ascending?: boolean }) => ({
        then: async (callback: (result: any) => void) => {
          const result = await railway.get(table, {
            select: columns,
            order: options?.ascending === false ? `${column}.desc` : `${column}.asc`
          })
          callback({ data: result, error: null })
        }
      }),
      then: async (callback: (result: any) => void) => {
        const result = await railway.get(table, {
          select: columns
        })
        callback({ data: result, error: null })
      }
    }),
    insert: (data: any) => ({
      select: (columns?: string) => ({
        single: async () => {
          const result = await railway.post(table, data)
          return { data: result[0] || null, error: null }
        },
        then: async (callback: (result: any) => void) => {
          const result = await railway.post(table, data)
          callback({ data: result, error: null })
        }
      }),
      then: async (callback: (result: any) => void) => {
        const result = await railway.post(table, data)
        callback({ data: result, error: null })
      }
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: (columns?: string) => ({
          single: async () => {
            const result = await railway.put(table, data, value)
            return { data: result[0] || null, error: null }
          },
          then: async (callback: (result: any) => void) => {
            const result = await railway.put(table, data, value)
            callback({ data: result, error: null })
          }
        }),
        then: async (callback: (result: any) => void) => {
          const result = await railway.put(table, data, value)
          callback({ data: result, error: null })
        }
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        then: async (callback: (result: any) => void) => {
          await railway.delete(table, value)
          callback({ data: null, error: null })
        }
      })
    }),
    // Добавляем метод search для совместимости с spaService
    search: async (filters: any) => {
      const queryParams: Record<string, string> = {}
      
      // Добавляем фильтры
      if (filters.featured !== undefined) {
        queryParams.featured = `eq.${filters.featured}`
      }
      if (filters.active !== undefined) {
        queryParams.active = `eq.${filters.active}`
      }
      if (filters.category) {
        queryParams.category = `eq.${filters.category}`
      }
      if (filters.purpose) {
        queryParams.purpose = `eq.${filters.purpose}`
      }
      if (filters.minPrice !== undefined) {
        queryParams.price = `gte.${filters.minPrice}`
      }
      if (filters.maxPrice !== undefined) {
        queryParams.price = `lte.${filters.maxPrice}`
      }
      if (filters.minRating !== undefined) {
        queryParams.rating = `gte.${filters.minRating}`
      }
      if (filters.location) {
        queryParams.location = `ilike.*${filters.location}*`
      }
      if (filters.searchTerm) {
        queryParams.or = `name.ilike.*${filters.searchTerm}*,description.ilike.*${filters.searchTerm}*`
      }
      
      const result = await railway.get(table, {
        select: '*',
        ...queryParams
      })
      
      return result
    }
  })
}