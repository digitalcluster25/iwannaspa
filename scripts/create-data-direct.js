import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'
const openaiKey = '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'

const supabase = createClient(supabaseUrl, supabaseKey)
const openai = new OpenAI({ apiKey: openaiKey })

const mockSpas = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Luxury Wellness Resort',
    description: 'Премиальный СПА-курорт с полным спектром wellness услуг. Включает массажные процедуры, термальные ванны, йогу и медитацию.',
    location: 'Киев',
    amenities: ['Сауна', 'Бассейн', 'Йога', 'Ресторан'],
    category: 'wellness',
    purpose: 'relaxation',
    price: 3400,
    rating: 4.8,
    review_count: 127,
    images: ['https://via.placeholder.com/800x600'],
    featured: true,
    active: true
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Термальный комплекс "Источник"',
    description: 'Уникальный термальный СПА-комплекс с естественными горячими источниками и лечебными процедурами.',
    location: 'Буковель',
    amenities: ['Термальные ванны', 'Грязелечение', 'Сауна'],
    category: 'thermal',
    purpose: 'health',
    price: 2500,
    rating: 4.6,
    review_count: 89,
    images: ['https://via.placeholder.com/800x600'],
    featured: false,
    active: true
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Medical SPA Clinic',
    description: 'Медицинский СПА-центр с профессиональными косметологическими и оздоровительными процедурами.',
    location: 'Львов',
    amenities: ['Косметология', 'Массаж'],
    category: 'medical',
    purpose: 'health',
    price: 3100,
    rating: 4.9,
    review_count: 156,
    images: ['https://via.placeholder.com/800x600'],
    featured: true,
    active: true
  }
]

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

async function createSpaWithEmbedding(spa) {
  try {
    console.log(`🚀 Creating spa: ${spa.name}`)
    
    // Создаем эмбеддинг
    const content = `${spa.name} ${spa.description} ${spa.location} ${spa.amenities.join(' ')} ${spa.category} ${spa.purpose}`
    const embedding = await createEmbedding(content)
    
    // Создаем запись в таблице spas
    const { data: spaData, error: spaError } = await supabase
      .from('spas')
      .upsert(spa, { onConflict: 'id' })
      .select()
      .single()
    
    if (spaError) {
      console.error(`❌ Error creating spa ${spa.name}:`, spaError)
      return
    }
    
    console.log(`✅ Spa created: ${spa.name}`)
    
    // Создаем эмбеддинг
    const { error: embeddingError } = await supabase
      .from('spa_embeddings')
      .upsert({
        spa_id: spa.id,
        content,
        embedding: `[${embedding.join(',')}]`
      }, { onConflict: 'spa_id' })
    
    if (embeddingError) {
      console.error(`❌ Error creating embedding for ${spa.name}:`, embeddingError)
      return
    }
    
    console.log(`✅ Embedding created for: ${spa.name}`)
    
  } catch (error) {
    console.error(`❌ Failed to create spa ${spa.name}:`, error)
  }
}

async function main() {
  console.log('🚀 Starting spa and embeddings creation...')
  
  for (const spa of mockSpas) {
    await createSpaWithEmbedding(spa)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Rate limiting
  }
  
  console.log('✅ All spas and embeddings created!')
}

main().catch(console.error)
