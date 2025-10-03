import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Supabase config:', {
  url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'MISSING',
  urlFull: supabaseUrl,
  key: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'MISSING',
  keyLength: supabaseAnonKey?.length,
  env: import.meta.env.MODE
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase variables')
  throw new Error('Missing Supabase environment variables')
}

console.log('🔍 Creating Supabase client...')
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
console.log('🔍 Supabase client created:', {
  hasAuth: !!supabase.auth,
  hasFrom: typeof supabase.from === 'function',
  supabaseUrl: supabase.supabaseUrl
})
