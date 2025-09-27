import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

console.log('🔄 Executing migration: add_location_fields')
console.log('')

// Проверяем существование полей
const { data: columns, error: checkError } = await supabase
  .from('spas')
  .select('*')
  .limit(1)

if (checkError) {
  console.error('❌ Error checking table:', checkError)
  process.exit(1)
}

console.log('✅ Table spas exists')
console.log('')
console.log('⚠️  Note: To add new columns to the spas table, please run this SQL in Supabase SQL Editor:')
console.log('')
console.log('-- Add location fields to spas table')
console.log('ALTER TABLE spas ADD COLUMN IF NOT EXISTS address TEXT;')
console.log('ALTER TABLE spas ADD COLUMN IF NOT EXISTS address_comment TEXT;')
console.log('ALTER TABLE spas ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);')
console.log('ALTER TABLE spas ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);')
console.log('')
console.log('📍 Go to: https://supabase.com/dashboard/project/' + supabaseUrl.split('//')[1].split('.')[0] + '/sql/new')
