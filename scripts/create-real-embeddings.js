import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'
const openaiKey = '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'

const supabase = createClient(supabaseUrl, supabaseKey)
const openai = new OpenAI({ apiKey: openaiKey })

async function createEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text
    })
    return response.data[0].embedding
  } catch (error) {
    console.error('Error creating embedding:', error)
    throw error
  }
}

async function createRealEmbeddings() {
  try {
    console.log('🚀 Creating real embeddings with OpenAI...')
    
    // Получаем существующие spas
    const { data: spas, error: spasError } = await supabase
      .from('spas')
      .select('*')
    
    if (spasError) {
      console.error('❌ Error fetching spas:', spasError)
      return
    }
    
    console.log(`📊 Found ${spas?.length || 0} spas to process`)
    
    for (const spa of spas || []) {
      try {
        console.log(`🔄 Processing: ${spa.name}`)
        
        // Создаем текст для эмбеддинга
        const content = `${spa.name} ${spa.description} ${spa.location} ${spa.amenities.join(' ')} ${spa.category} ${spa.purpose}`
        
        // Создаем эмбеддинг
        const embedding = await createEmbedding(content)
        
        // Сохраняем эмбеддинг
        const { error } = await supabase
          .from('spa_embeddings')
          .insert({
            spa_id: spa.id,
            content,
            embedding: `[${embedding.join(',')}]`
          })
        
        if (error) {
          console.error(`❌ Error saving embedding for ${spa.name}:`, error)
        } else {
          console.log(`✅ Embedding created for: ${spa.name}`)
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`❌ Failed to process ${spa.name}:`, error)
      }
    }
    
    console.log('✅ All embeddings created!')
    
    // Тестируем поиск
    console.log('🔍 Testing search...')
    const { data: searchResults, error: searchError } = await supabase
      .rpc('search_spas', {
        query_embedding: `[${(await createEmbedding('расслабляющий массаж в Киеве')).join(',')}]`,
        match_threshold: 0.7,
        match_count: 5
      })
    
    if (searchError) {
      console.error('❌ Error testing search:', searchError)
    } else {
      console.log(`🔍 Search test returned ${searchResults?.length || 0} results`)
      searchResults?.forEach(result => {
        console.log(`  - ${result.spa_id}: ${(result.similarity * 100).toFixed(1)}% similarity`)
      })
    }
    
  } catch (error) {
    console.error('❌ Failed to create embeddings:', error)
  }
}

createRealEmbeddings()
