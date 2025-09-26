import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const openaiKey = process.env.VITE_OPENAI_API_KEY

const supabase = createClient(supabaseUrl, supabaseKey)
const openai = new OpenAI({
  apiKey: openaiKey,
  dangerouslyAllowBrowser: true
})

async function testRealSearch() {
  console.log('🔍 Тестируем реальный поиск...')
  
  try {
    const queries = [
      'массаж в Киеве',
      'расслабляющий массаж',
      'wellness в Киеве',
      'сауна и бассейн'
    ]
    
    for (const query of queries) {
      console.log(`\n📝 Запрос: "${query}"`)
      
      // Создаем embedding для запроса
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: query
      })
      
      const queryEmbedding = response.data[0].embedding
      console.log(`✅ Создан embedding (${queryEmbedding.length} измерений)`)
      
      // Тестируем поиск с разными порогами
      const thresholds = [0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]
      
      for (const threshold of thresholds) {
        const { data: searchResults, error: searchError } = await supabase.rpc('search_spas', {
          query_embedding: queryEmbedding,
          match_threshold: threshold,
          match_count: 5
        })
        
        if (searchError) {
          console.error(`❌ Ошибка поиска с порогом ${threshold}:`, searchError)
          break
        }
        
        if (searchResults.length > 0) {
          console.log(`✅ Найдено ${searchResults.length} результатов с порогом ${threshold}:`)
          searchResults.forEach((result, index) => {
            console.log(`  ${index + 1}. Схожесть: ${result.similarity.toFixed(3)}`)
            console.log(`     Контент: ${result.content.substring(0, 80)}...`)
          })
          break
        }
      }
    }
    
    console.log('\n🎯 Проверяем компонент SemanticSearch...')
    console.log('Откройте http://localhost:3000/search и протестируйте поиск вручную')
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  }
}

testRealSearch()
