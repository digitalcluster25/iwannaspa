// Переключение между Supabase и Railway
import { database, supabase as supabaseAuth } from './database'

// Для совместимости экспортируем database как supabase
export const supabase = database

// Экспортируем также оригинальный Supabase клиент для аутентификации
export { supabaseAuth }

// Логирование
console.log('🔧 Database client initialized')
