// Универсальный клиент БД
// Использует Railway PostgREST для всех запросов к БД
// Supabase используется только для Auth

export { railway as supabase } from './railway'
export { supabase as supabaseAuth } from './railway'
