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

async function createRealEmbeddingFinal() {
  console.log('🔧 Создаем реальный embedding для существующего СПА...')
  
  try {
    // Получаем СПА в Киеве
    const { data: spas, error: spasError } = await supabase
      .from('spas')
      .select('id, name, description, location, amenities, category, purpose')
      .eq('location', 'Киев')
      .limit(1)
    
    if (spasError || spas.length === 0) {
      console.error('❌ СПА в Киеве не найден')
      return
    }
    
    const spa = spas[0]
    console.log(`✅ СПА: ${spa.name}`)
    
    // Создаем контент с упоминанием массажа
    const content = `${spa.name} ${spa.description} массаж расслабляющий процедуры ${spa.location} ${spa.amenities.join(' ')} ${spa.category} ${spa.purpose}`
    console.log(`📝 Контент: ${content}`)
    
    // Создаем реальный embedding
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: content
    })
    
    const embedding = response.data[0].embedding
    console.log(`✅ Создан embedding (${embedding.length} измерений)`)
    
    // Очищаем таблицу
    await supabase.from('spa_embeddings').delete().neq('spa_id', '00000000-0000-0000-0000-000000000000')
    
    // Вставляем реальный embedding через SQL
    const { data: insertResult, error: insertError } = await supabase
      .from('spa_embeddings')
      .insert({
        spa_id: spa.id,
        content: content,
        embedding: `[${embedding.join(',')}]` // Преобразуем в строку для PostgreSQL
      })
    
    if (insertError) {
      console.error('❌ Ошибка вставки:', insertError)
      return
    }
    
    console.log('✅ Реальный embedding создан!')
    
    // Проверяем что получилось
    const { data: checkData, error: checkError } = await supabase
      .from('spa_embeddings')
      .select('spa_id, content, embedding')
      .single()
    
    if (checkError) {
      console.error('❌ Ошибка проверки:', checkError)
      return
    }
    
    console.log(`✅ Проверка: embedding имеет ${checkData.embedding.length} символов`)
    
    // Тестируем поиск
    console.log('\n🔎 Тестируем поиск "массаж в Киеве":')
    const query = 'массаж в Киеве'
    
    const queryResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query
    })
    
    const queryEmbedding = queryResponse.data[0].embedding
    
    // Пробуем разные пороги
    const thresholds = [0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]
    
    for (const threshold of thresholds) {
      const { data: searchResults, error: searchError } = await supabase.rpc('search_spas', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: 5
      })
      
      if (searchError) {
        console.error(`❌ Ошибка поиска:`, searchError)
        break
      }
      
      if (searchResults.length > 0) {
        console.log(`✅ Найдено ${searchResults.length} результатов с порогом ${threshold}:`)
        searchResults.forEach((result, index) => {
          console.log(`  ${index + 1}. Схожесть: ${result.similarity.toFixed(3)}`)
          console.log(`     Контент: ${result.content.substring(0, 80)}...`)
        })
        console.log(`\n🎉 Поиск работает с порогом ${threshold}!`)
        break
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  }
}

createRealEmbeddingFinal()
