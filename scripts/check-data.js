import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkData() {
  try {
    console.log('🔍 Checking existing data...')
    
    // Проверяем spas
    const { data: spas, error: spasError } = await supabase
      .from('spas')
      .select('*')
    
    if (spasError) {
      console.error('❌ Error fetching spas:', spasError)
    } else {
      console.log(`📊 Found ${spas?.length || 0} spas:`)
      spas?.forEach(spa => {
        console.log(`  - ${spa.name} (${spa.location})`)
      })
    }
    
    // Проверяем embeddings
    const { data: embeddings, error: embeddingsError } = await supabase
      .from('spa_embeddings')
      .select('*')
    
    if (embeddingsError) {
      console.error('❌ Error fetching embeddings:', embeddingsError)
    } else {
      console.log(`📊 Found ${embeddings?.length || 0} embeddings:`)
      embeddings?.forEach(embedding => {
        console.log(`  - Spa ID: ${embedding.spa_id}`)
      })
    }
    
    // Тестируем поиск
    if (spas && spas.length > 0) {
      console.log('🔍 Testing search function...')
      const { data: searchResults, error: searchError } = await supabase
        .rpc('search_spas', {
          query_embedding: '[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0,1.1,1.2,1.3,1.4,1.5]',
          match_threshold: 0.1,
          match_count: 5
        })
      
      if (searchError) {
        console.error('❌ Error testing search:', searchError)
      } else {
        console.log(`🔍 Search test returned ${searchResults?.length || 0} results`)
      }
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error)
  }
}

checkData()
