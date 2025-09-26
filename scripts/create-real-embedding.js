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

async function createRealEmbedding() {
  console.log('🔍 Создаем реальный embedding для существующего СПА...')
  
  try {
    // Получаем существующий СПА
    const { data: spas, error: spasError } = await supabase
      .from('spas')
      .select('id, name, description, location, amenities, category, purpose')
      .limit(1)
    
    if (spasError) {
      console.error('❌ Ошибка при получении СПА:', spasError)
      return
    }
    
    if (spas.length === 0) {
      console.error('❌ СПА не найдены')
      return
    }
    
    const spa = spas[0]
    console.log(`✅ Найден СПА: ${spa.name}`)
    
    // Создаем контент для embedding
    const content = `${spa.name} ${spa.description} ${spa.location} ${spa.amenities.join(' ')} ${spa.category} ${spa.purpose}`
    console.log(`📝 Контент для embedding: ${content}`)
    
    // Создаем реальный embedding
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: content
    })
    
    const embedding = response.data[0].embedding
    console.log(`✅ Создан реальный embedding (${embedding.length} измерений)`)
    
    // Удаляем старый embedding если есть
    await supabase
      .from('spa_embeddings')
      .delete()
      .eq('spa_id', spa.id)
    
    // Создаем новый embedding
    const { data: insertData, error: insertError } = await supabase
      .from('spa_embeddings')
      .insert({
        spa_id: spa.id,
        content: content,
        embedding: embedding
      })
    
    if (insertError) {
      console.error('❌ Ошибка при создании embedding:', insertError)
      return
    }
    
    console.log('✅ Embedding успешно создан!')
    
    // Тестируем поиск
    console.log('\n🔎 Тестируем поиск с реальным embedding:')
    const query = 'расслабляющий массаж в Киеве'
    
    const queryResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query
    })
    
    const queryEmbedding = queryResponse.data[0].embedding
    
    const { data: searchResults, error: searchError } = await supabase.rpc('search_spas', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
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
    console.error('❌ Ошибка:', error)
  }
}

createRealEmbedding()
