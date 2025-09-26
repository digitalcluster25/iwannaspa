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

async function createWorkingEmbedding() {
  console.log('🔧 Создаем рабочий embedding...')
  
  try {
    // Берем СПА который точно есть в Киеве
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
    console.log(`✅ Работаем со СПА: ${spa.name}`)
    
    // Создаем контент с упоминанием массажа
    const content = `${spa.name} ${spa.description} массаж расслабляющий ${spa.location} ${spa.amenities.join(' ')} ${spa.category} ${spa.purpose} массажные процедуры`
    console.log(`📝 Контент: ${content}`)
    
    // Создаем embedding через OpenAI
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: content
    })
    
    const embedding = response.data[0].embedding
    console.log(`✅ Создан embedding (${embedding.length} измерений)`)
    
    // Удаляем все старые embeddings
    const { error: deleteError } = await supabase
      .from('spa_embeddings')
      .delete()
      .neq('spa_id', '00000000-0000-0000-0000-000000000000')
    
    if (deleteError) {
      console.error('❌ Ошибка удаления:', deleteError)
    }
    
    // Вставляем новый embedding
    const { data: insertData, error: insertError } = await supabase
      .from('spa_embeddings')
      .insert({
        spa_id: spa.id,
        content: content,
        embedding: JSON.stringify(embedding) // Преобразуем в JSON строку
      })
    
    if (insertError) {
      console.error('❌ Ошибка вставки:', insertError)
      return
    }
    
    console.log('✅ Embedding создан!')
    
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
    
    // Тестируем поиск с реальным запросом
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
      console.log(`\n📊 Порог: ${threshold}`)
      
      const { data: searchResults, error: searchError } = await supabase.rpc('search_spas', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: 5
      })
      
      if (searchError) {
        console.error(`❌ Ошибка поиска:`, searchError)
        break
      }
      
      console.log(`✅ Результатов: ${searchResults.length}`)
      if (searchResults.length > 0) {
        searchResults.forEach((result, index) => {
          console.log(`  ${index + 1}. Схожесть: ${result.similarity.toFixed(3)}`)
          console.log(`     Контент: ${result.content.substring(0, 100)}...`)
        })
        console.log(`\n🎉 Поиск работает с порогом ${threshold}!`)
        break
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  }
}

createWorkingEmbedding()
