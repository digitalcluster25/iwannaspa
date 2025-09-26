import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixRLS() {
  console.log('🔧 Проверяем и исправляем RLS...')
  
  try {
    // Проверяем текущие данные
    const { data: embeddings, error: embError } = await supabase
      .from('spa_embeddings')
      .select('*')
    
    if (embError) {
      console.error('❌ Ошибка при получении embeddings:', embError)
      return
    }
    
    console.log(`✅ Найдено ${embeddings.length} embeddings в таблице`)
    
    // Тестируем прямой поиск без функции
    console.log('\n🔍 Тестируем прямой поиск:')
    const { data: directSearch, error: directError } = await supabase
      .from('spa_embeddings')
      .select('spa_id, content')
      .limit(1)
    
    if (directError) {
      console.error('❌ Ошибка прямого поиска:', directError)
      return
    }
    
    console.log(`✅ Прямой поиск работает: ${directSearch.length} результатов`)
    
    // Проверяем функцию поиска напрямую
    console.log('\n🔍 Тестируем функцию search_spas:')
    
    // Создаем тестовый вектор
    const testVector = Array(1536).fill(0.1)
    
    const { data: functionSearch, error: functionError } = await supabase.rpc('search_spas', {
      query_embedding: testVector,
      match_threshold: 0.1,
      match_count: 5
    })
    
    if (functionError) {
      console.error('❌ Ошибка функции search_spas:', functionError)
      return
    }
    
    console.log(`✅ Функция search_spas работает: ${functionSearch.length} результатов`)
    
    if (functionSearch.length > 0) {
      console.log('🎯 Поиск работает! Проблема была в пороге схожести.')
      functionSearch.forEach((result, index) => {
        console.log(`  ${index + 1}. СПА ID: ${result.spa_id}`)
        console.log(`     Схожесть: ${result.similarity.toFixed(3)}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  }
}

fixRLS()
