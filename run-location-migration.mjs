import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function runMigration() {
  console.log('🔄 Running migration: add_location_fields.sql')
  
  const migrationSQL = readFileSync(
    join(process.cwd(), 'supabase/migrations/add_location_fields.sql'),
    'utf-8'
  )
  
  const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL })
  
  if (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
  
  console.log('✅ Migration completed successfully')
}

runMigration()
