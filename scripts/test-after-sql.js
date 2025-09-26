import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAfterSQL() {
  console.log('🔍 Проверяем состояние после SQL...')
  
  try {
    // Проверяем embeddings
    const { data: embeddings, error: embError } = await supabase
      .from('spa_embeddings')
      .select('spa_id, content, embedding')
    
    if (embError) {
      console.error('❌ Ошибка embeddings:', embError)
      return
    }
    
    console.log(`✅ Embeddings (${embeddings.length}):`)
    embeddings.forEach(emb => {
      console.log(`  - СПА ID: ${emb.spa_id}`)
      console.log(`    Контент: ${emb.content}`)
      console.log(`    Размерность: ${emb.embedding.length}`)
    })
    
    // Тестируем функцию поиска напрямую
    console.log('\n🔎 Тестируем функцию search_spas:')
    
    // Создаем тестовый вектор той же размерности
    const testVector = Array(1536).fill(0.1)
    
    const { data: searchResults, error: searchError } = await supabase.rpc('search_spas', {
      query_embedding: testVector,
      match_threshold: 0.0, // самый низкий порог
      match_count: 5
    })
    
    if (searchError) {
      console.error('❌ Ошибка функции search_spas:', searchError)
      return
    }
    
    console.log(`✅ Результатов: ${searchResults.length}`)
    searchResults.forEach((result, index) => {
      console.log(`  ${index + 1}. СПА ID: ${result.spa_id}`)
      console.log(`     Схожесть: ${result.similarity.toFixed(3)}`)
      console.log(`     Контент: ${result.content.substring(0, 100)}...`)
    })
    
    if (searchResults.length === 0) {
      console.log('\n❌ Функция search_spas не возвращает результатов')
      console.log('🔍 Проверяем индексы...')
      
      // Проверяем есть ли индексы
      const { data: indexes, error: idxError } = await supabase
        .rpc('exec', { sql: "SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'spa_embeddings'" })
      
      if (idxError) {
        console.log('⚠️ Не удалось проверить индексы')
      } else {
        console.log('📊 Индексы:', indexes)
      }
    } else {
      console.log('\n🎉 Функция search_spas работает!')
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  }
}

testAfterSQL()
