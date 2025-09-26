import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const openaiKey = process.env.VITE_OPENAI_API_KEY

if (!supabaseUrl || !supabaseKey || !openaiKey) {
  console.error('❌ Отсутствуют переменные окружения')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const openai = new OpenAI({
  apiKey: openaiKey,
  dangerouslyAllowBrowser: true
})

async function testSearch() {
  console.log('🔍 Тестируем семантический поиск...')
  
  // 1. Проверяем данные в таблице spas
  console.log('\n📋 Проверяем СПА:')
  const { data: spas, error: spasError } = await supabase
    .from('spas')
    .select('id, name, location')
  
  if (spasError) {
    console.error('❌ Ошибка при получении СПА:', spasError)
    return
  }
  
  console.log(`✅ Найдено ${spas.length} СПА:`)
  spas.forEach(spa => {
    console.log(`  - ${spa.name} (${spa.location}) - ID: ${spa.id}`)
  })
  
  // 2. Проверяем embeddings
  console.log('\n🧠 Проверяем embeddings:')
  const { data: embeddings, error: embError } = await supabase
    .from('spa_embeddings')
    .select('spa_id, content')
  
  if (embError) {
    console.error('❌ Ошибка при получении embeddings:', embError)
    return
  }
  
  console.log(`✅ Найдено ${embeddings.length} embeddings:`)
  embeddings.forEach(emb => {
    console.log(`  - СПА ID: ${emb.spa_id}`)
    console.log(`    Контент: ${emb.content.substring(0, 100)}...`)
  })
  
  // 3. Тестируем поиск
  console.log('\n🔎 Тестируем поиск:')
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
    
    // Выполняем поиск
    const { data: searchResults, error: searchError } = await supabase.rpc('search_spas', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 5
    })
    
    if (searchError) {
      console.error('❌ Ошибка поиска:', searchError)
      return
    }
    
    console.log(`✅ Найдено ${searchResults.length} результатов:`)
    searchResults.forEach((result, index) => {
      console.log(`  ${index + 1}. СПА ID: ${result.spa_id}`)
      console.log(`     Схожесть: ${result.similarity.toFixed(3)}`)
      console.log(`     Контент: ${result.content.substring(0, 100)}...`)
    })
    
  } catch (error) {
    console.error('❌ Ошибка при создании embedding:', error)
  }
}

testSearch()
