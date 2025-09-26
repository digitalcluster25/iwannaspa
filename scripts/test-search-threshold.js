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

async function testSearchWithThresholds() {
  console.log('🔍 Тестируем поиск с разными порогами схожести...')
  
  const query = 'расслабляющий массаж в Киеве'
  console.log(`Запрос: "${query}"`)
  
  try {
    // Создаем embedding для запроса
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query
    })
    
    const queryEmbedding = response.data[0].embedding
    console.log(`✅ Создан embedding для запроса (${queryEmbedding.length} измерений)`)
    
    // Тестируем с разными порогами
    const thresholds = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]
    
    for (const threshold of thresholds) {
      console.log(`\n📊 Порог схожести: ${threshold}`)
      
      const { data: searchResults, error: searchError } = await supabase.rpc('search_spas', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: 5
      })
      
      if (searchError) {
        console.error(`❌ Ошибка поиска с порогом ${threshold}:`, searchError)
        continue
      }
      
      console.log(`✅ Найдено ${searchResults.length} результатов:`)
      searchResults.forEach((result, index) => {
        console.log(`  ${index + 1}. СПА ID: ${result.spa_id}`)
        console.log(`     Схожесть: ${result.similarity.toFixed(3)}`)
        console.log(`     Контент: ${result.content.substring(0, 80)}...`)
      })
      
      if (searchResults.length > 0) {
        console.log(`\n🎯 Найден рабочий порог: ${threshold}`)
        break
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка при создании embedding:', error)
  }
}

testSearchWithThresholds()
