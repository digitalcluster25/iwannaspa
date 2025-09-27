import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Supabase config:', {
  url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'MISSING',
  key: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'MISSING',
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase variables')
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
