import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'
const openaiKey = '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'

const supabase = createClient(supabaseUrl, supabaseKey)
const openai = new OpenAI({ apiKey: openaiKey })

async function testSearch() {
  try {
    console.log('🔍 Testing semantic search...')
    
    // Создаем эмбеддинг для тестового запроса
    const query = 'расслабляющий массаж в Киеве'
    const queryEmbedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query
    })
    
    console.log(`📝 Query: "${query}"`)
    console.log(`📊 Embedding dimension: ${queryEmbedding.data[0].embedding.length}`)
    
    // Тестируем поиск
    const { data: searchResults, error: searchError } = await supabase
      .rpc('search_spas', {
        query_embedding: `[${queryEmbedding.data[0].embedding.join(',')}]`,
        match_threshold: 0.1, // Низкий порог для тестирования
        match_count: 5
      })
    
    if (searchError) {
      console.error('❌ Error testing search:', searchError)
      
      // Если нет эмбеддингов, показываем доступные spas
      const { data: spas, error: spasError } = await supabase
        .from('spas')
        .select('*')
      
      if (!spasError && spas) {
        console.log(`📊 Available spas (${spas.length}):`)
        spas.forEach(spa => {
          console.log(`  - ${spa.name} (${spa.location}) - ${spa.category}`)
        })
      }
      
    } else {
      console.log(`🔍 Search returned ${searchResults?.length || 0} results:`)
      searchResults?.forEach((result, index) => {
        console.log(`  ${index + 1}. Spa ID: ${result.spa_id}, Similarity: ${(result.similarity * 100).toFixed(1)}%`)
        console.log(`     Content: ${result.content.substring(0, 100)}...`)
      })
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testSearch()
