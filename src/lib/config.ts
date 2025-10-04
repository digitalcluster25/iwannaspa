// Конфигурация для переключения между Supabase и Railway

export const CONFIG = {
  // Переключение между Supabase и Railway
  // В продакшене используем Supabase, локально - Railway API
  USE_RAILWAY: import.meta.env.VITE_USE_RAILWAY === 'true' && 
               import.meta.env.VITE_RAILWAY_POSTGREST_URL?.includes('localhost'),
  
  // Supabase конфигурация
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://ewkeuupfristqqonkcph.supabase.co',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E',
  
  // Railway конфигурация
  RAILWAY_POSTGREST_URL: import.meta.env.VITE_RAILWAY_POSTGREST_URL || 'http://localhost:3000',
  
  // Схема базы данных
  DATABASE_SCHEMA: import.meta.env.VITE_USE_RAILWAY === 'true' ? 'app' : 'public',
}

// Логирование текущей конфигурации
console.log('🔧 Config loaded:', {
  USE_RAILWAY: CONFIG.USE_RAILWAY,
  DATABASE_SCHEMA: CONFIG.DATABASE_SCHEMA,
  API_URL: CONFIG.USE_RAILWAY ? CONFIG.RAILWAY_POSTGREST_URL : CONFIG.SUPABASE_URL,
  ENV_VITE_USE_RAILWAY: import.meta.env.VITE_USE_RAILWAY,
  ENV_VITE_RAILWAY_POSTGREST_URL: import.meta.env.VITE_RAILWAY_POSTGREST_URL
})

// Логирование в зависимости от окружения
if (CONFIG.USE_RAILWAY) {
  console.log('🚂 Using Railway API for data operations (local development)')
} else {
  console.log('☁️ Using Supabase for data operations (production)')
}
console.log('🌍 Environment check:', {
  VITE_USE_RAILWAY: import.meta.env.VITE_USE_RAILWAY,
  VITE_RAILWAY_POSTGREST_URL: import.meta.env.VITE_RAILWAY_POSTGREST_URL,
  isLocalhost: import.meta.env.VITE_RAILWAY_POSTGREST_URL?.includes('localhost')
})
