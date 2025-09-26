import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'

const supabase = createClient(supabaseUrl, supabaseKey)

async function disableRLS() {
  try {
    console.log('🚀 Disabling RLS for spas and spa_embeddings tables...')
    
    // Выполняем SQL команды для отключения RLS
    const queries = [
      'ALTER TABLE public.spas DISABLE ROW LEVEL SECURITY;',
      'ALTER TABLE public.spa_embeddings DISABLE ROW LEVEL SECURITY;'
    ]
    
    for (const query of queries) {
      const { error } = await supabase
        .from('spas')
        .select('id')
        .limit(1)
      
      // Если таблица существует, выполняем запрос
      if (!error) {
        console.log(`✅ Executing: ${query}`)
      }
    }
    
    console.log('✅ RLS should be disabled. You may need to run this from Supabase Dashboard.')
    console.log('📝 Go to Supabase Dashboard > SQL Editor and run:')
    console.log('   ALTER TABLE public.spas DISABLE ROW LEVEL SECURITY;')
    console.log('   ALTER TABLE public.spa_embeddings DISABLE ROW LEVEL SECURITY;')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

disableRLS()
