import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCurrentState() {
  console.log('🔍 Проверяем текущее состояние...')
  
  try {
    // Проверяем СПА
    const { data: spas, error: spasError } = await supabase
      .from('spas')
      .select('id, name, location, amenities')
    
    if (spasError) {
      console.error('❌ Ошибка СПА:', spasError)
      return
    }
    
    console.log(`✅ СПА (${spas.length}):`)
    spas.forEach(spa => {
      console.log(`  - ${spa.name} (${spa.location})`)
      console.log(`    Услуги: ${spa.amenities.join(', ')}`)
    })
    
    // Проверяем embeddings
    const { data: embeddings, error: embError } = await supabase
      .from('spa_embeddings')
      .select('spa_id, content, embedding')
    
    if (embError) {
      console.error('❌ Ошибка embeddings:', embError)
      return
    }
    
    console.log(`\n🧠 Embeddings (${embeddings.length}):`)
    embeddings.forEach(emb => {
      console.log(`  - СПА ID: ${emb.spa_id}`)
      console.log(`    Контент: ${emb.content}`)
      console.log(`    Размерность: ${emb.embedding.length}`)
    })
    
    // Тестируем поиск с разными запросами
    console.log('\n🔎 Тестируем поиск:')
    
    const queries = [
      'массаж',
      'Киев',
      'расслабляющий массаж',
      'wellness',
      'сауна'
    ]
    
    for (const query of queries) {
      console.log(`\n📝 Запрос: "${query}"`)
      
      // Создаем простой тестовый вектор
      const testVector = Array(1536).fill(0.1)
      
      const { data: results, error: searchError } = await supabase.rpc('search_spas', {
        query_embedding: testVector,
        match_threshold: 0.0, // очень низкий порог
        match_count: 5
      })
      
      if (searchError) {
        console.error(`❌ Ошибка поиска:`, searchError)
      } else {
        console.log(`✅ Результатов: ${results.length}`)
        results.forEach((result, index) => {
          console.log(`  ${index + 1}. Схожесть: ${result.similarity.toFixed(3)}`)
        })
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  }
}

checkCurrentState()
