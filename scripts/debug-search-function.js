import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugSearchFunction() {
  console.log('🔍 Отладка функции поиска...')
  
  try {
    // Получаем все embeddings
    const { data: embeddings, error: embError } = await supabase
      .from('spa_embeddings')
      .select('spa_id, content, embedding')
    
    if (embError) {
      console.error('❌ Ошибка при получении embeddings:', embError)
      return
    }
    
    console.log(`✅ Найдено ${embeddings.length} embeddings`)
    
    if (embeddings.length === 0) {
      console.error('❌ Нет embeddings для тестирования')
      return
    }
    
    // Берем первый embedding
    const firstEmbedding = embeddings[0]
    console.log(`📝 Тестируем с embedding СПА ID: ${firstEmbedding.spa_id}`)
    console.log(`📝 Контент: ${firstEmbedding.content.substring(0, 100)}...`)
    
    // Проверяем размерность embedding
    const embeddingArray = firstEmbedding.embedding
    console.log(`📊 Размерность embedding: ${embeddingArray.length}`)
    
    if (embeddingArray.length !== 1536) {
      console.error(`❌ Неправильная размерность embedding: ${embeddingArray.length}, ожидается 1536`)
      return
    }
    
    // Тестируем функцию с тем же embedding (должно дать схожесть 1.0)
    console.log('\n🔍 Тестируем функцию с тем же embedding:')
    const { data: sameSearch, error: sameError } = await supabase.rpc('search_spas', {
      query_embedding: embeddingArray,
      match_threshold: 0.5,
      match_count: 5
    })
    
    if (sameError) {
      console.error('❌ Ошибка функции search_spas:', sameError)
      return
    }
    
    console.log(`✅ Результатов с тем же embedding: ${sameSearch.length}`)
    sameSearch.forEach((result, index) => {
      console.log(`  ${index + 1}. СПА ID: ${result.spa_id}`)
      console.log(`     Схожесть: ${result.similarity.toFixed(3)}`)
    })
    
    // Тестируем с очень низким порогом
    console.log('\n🔍 Тестируем с порогом 0.0:')
    const { data: lowSearch, error: lowError } = await supabase.rpc('search_spas', {
      query_embedding: embeddingArray,
      match_threshold: 0.0,
      match_count: 5
    })
    
    if (lowError) {
      console.error('❌ Ошибка функции search_spas с низким порогом:', lowError)
      return
    }
    
    console.log(`✅ Результатов с порогом 0.0: ${lowSearch.length}`)
    lowSearch.forEach((result, index) => {
      console.log(`  ${index + 1}. СПА ID: ${result.spa_id}`)
      console.log(`     Схожесть: ${result.similarity.toFixed(3)}`)
    })
    
    // Проверяем индексы
    console.log('\n🔍 Проверяем индексы:')
    const { data: indexInfo, error: indexError } = await supabase
      .from('pg_indexes')
      .select('*')
      .eq('tablename', 'spa_embeddings')
    
    if (indexError) {
      console.log('⚠️ Не удалось получить информацию об индексах:', indexError.message)
    } else {
      console.log(`✅ Найдено ${indexInfo.length} индексов для spa_embeddings`)
      indexInfo.forEach(index => {
        console.log(`  - ${index.indexname}: ${index.indexdef}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  }
}

debugSearchFunction()
