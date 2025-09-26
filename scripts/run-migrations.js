import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  try {
    console.log('🚀 Running migration to disable RLS...')
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.spas DISABLE ROW LEVEL SECURITY;'
    })
    
    if (error) {
      console.error('Error disabling RLS for spas:', error)
      return
    }
    
    console.log('✅ RLS disabled for spas table')
    
    const { data: data2, error: error2 } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.spa_embeddings DISABLE ROW LEVEL SECURITY;'
    })
    
    if (error2) {
      console.error('Error disabling RLS for spa_embeddings:', error2)
      return
    }
    
    console.log('✅ RLS disabled for spa_embeddings table')
    console.log('✅ Migration completed successfully!')
    
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

runMigration()
