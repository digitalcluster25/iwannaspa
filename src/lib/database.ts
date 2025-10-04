// Универсальный клиент базы данных
// Автоматически переключается между Supabase и Railway

import { createClient } from '@supabase/supabase-js'
import { CONFIG } from './config'
import { railwaySupabase } from './railway'

// Создаем Supabase клиент
const supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: CONFIG.DATABASE_SCHEMA,
  },
})

// Экспортируем нужный клиент в зависимости от конфигурации
export const database = CONFIG.USE_RAILWAY ? railwaySupabase : supabaseClient

// Экспортируем также оригинальный Supabase клиент для аутентификации
export const supabase = supabaseClient

// Логирование
if (CONFIG.USE_RAILWAY) {
  console.log('🚂 Using Railway PostgreSQL + PostgREST')
} else {
  console.log('☁️ Using Supabase')
}
