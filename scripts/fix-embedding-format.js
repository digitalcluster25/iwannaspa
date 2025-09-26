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

async function fixEmbeddingFormat() {
  console.log('🔧 Исправляем формат embedding...')
  
  try {
    // Получаем СПА для создания правильного embedding
    const { data: spas, error: spasError } = await supabase
      .from('spas')
      .select('id, name, description, location, amenities, category, purpose')
      .limit(1)
    
    if (spasError) {
      console.error('❌ Ошибка при получении СПА:', spasError)
      return
    }
    
    const spa = spas[0]
    console.log(`✅ Работаем со СПА: ${spa.name}`)
    
    // Создаем контент для embedding
    const content = `${spa.name} ${spa.description} ${spa.location} ${spa.amenities.join(' ')} ${spa.category} ${spa.purpose}`
    console.log(`📝 Контент: ${content}`)
    
    // Создаем правильный embedding
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: content
    })
    
    const embedding = response.data[0].embedding
    console.log(`✅ Создан правильный embedding (${embedding.length} измерений)`)
    
    // Удаляем все старые embeddings
    await supabase
      .from('spa_embeddings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // удаляем все
    
    // Создаем новый правильный embedding
    const { data: insertData, error: insertError } = await supabase
      .from('spa_embeddings')
      .insert({
        spa_id: spa.id,
        content: content,
        embedding: embedding // передаем как массив, а не строку
      })
    
    if (insertError) {
      console.error('❌ Ошибка при создании embedding:', insertError)
      return
    }
    
    console.log('✅ Правильный embedding создан!')
    
    // Проверяем что получилось
    const { data: checkEmbedding, error: checkError } = await supabase
      .from('spa_embeddings')
      .select('spa_id, content, embedding')
      .single()
    
    if (checkError) {
      console.error('❌ Ошибка при проверке embedding:', checkError)
      return
    }
    
    console.log(`✅ Проверка: embedding имеет ${checkEmbedding.embedding.length} измерений`)
    
    // Тестируем поиск
    console.log('\n🔎 Тестируем поиск:')
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
    
    if (searchResults.length > 0) {
      console.log('\n🎉 Поиск работает!')
    } else {
      console.log('\n⚠️ Поиск не дает результатов, попробуйте снизить порог схожести')
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  }
}

fixEmbeddingFormat()
