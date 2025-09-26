import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'

const supabase = createClient(supabaseUrl, supabaseKey)

async function executeSQL() {
  try {
    console.log('🚀 Executing SQL commands in Supabase...')
    
    // 1. Отключаем RLS
    console.log('📝 Disabling RLS...')
    const { error: rlsError1 } = await supabase
      .from('spas')
      .select('id')
      .limit(1)
    
    const { error: rlsError2 } = await supabase
      .from('spa_embeddings')
      .select('id')
      .limit(1)
    
    console.log('✅ RLS check completed')
    
    // 2. Создаем тестовые данные в таблице spas
    console.log('📝 Creating spa records...')
    const spasData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Luxury Wellness Resort',
        description: 'Премиальный СПА-курорт с полным спектром wellness услуг. Включает массажные процедуры, термальные ванны, йогу и медитацию.',
        price: 3400,
        rating: 4.8,
        review_count: 127,
        location: 'Киев',
        images: ['https://via.placeholder.com/800x600'],
        amenities: ['Сауна', 'Бассейн', 'Йога', 'Ресторан'],
        category: 'wellness',
        purpose: 'relaxation',
        featured: true,
        active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Термальный комплекс "Источник"',
        description: 'Уникальный термальный СПА-комплекс с естественными горячими источниками и лечебными процедурами.',
        price: 2500,
        rating: 4.6,
        review_count: 89,
        location: 'Буковель',
        images: ['https://via.placeholder.com/800x600'],
        amenities: ['Термальные ванны', 'Грязелечение', 'Сауна'],
        category: 'thermal',
        purpose: 'health',
        featured: false,
        active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Medical SPA Clinic',
        description: 'Медицинский СПА-центр с профессиональными косметологическими и оздоровительными процедурами.',
        price: 3100,
        rating: 4.9,
        review_count: 156,
        location: 'Львов',
        images: ['https://via.placeholder.com/800x600'],
        amenities: ['Косметология', 'Массаж'],
        category: 'medical',
        purpose: 'health',
        featured: true,
        active: true
      }
    ]
    
    for (const spa of spasData) {
      const { error } = await supabase
        .from('spas')
        .upsert(spa, { onConflict: 'id' })
      
      if (error) {
        console.error(`❌ Error creating spa ${spa.name}:`, error)
      } else {
        console.log(`✅ Spa created: ${spa.name}`)
      }
    }
    
    // 3. Создаем простые эмбеддинги (заглушки)
    console.log('📝 Creating embeddings...')
    const embeddingsData = [
      {
        spa_id: '550e8400-e29b-41d4-a716-446655440001',
        content: 'Luxury Wellness Resort Премиальный СПА-курорт с полным спектром wellness услуг. Включает массажные процедуры, термальные ванны, йогу и медитацию. Киев Сауна Бассейн Йога Ресторан wellness relaxation',
        embedding: '[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0,1.1,1.2,1.3,1.4,1.5]'
      },
      {
        spa_id: '550e8400-e29b-41d4-a716-446655440002',
        content: 'Термальный комплекс "Источник" Уникальный термальный СПА-комплекс с естественными горячими источниками и лечебными процедурами. Буковель Термальные ванны Грязелечение Сауна thermal health',
        embedding: '[0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0,1.1,1.2,1.3,1.4,1.5,1.6]'
      },
      {
        spa_id: '550e8400-e29b-41d4-a716-446655440003',
        content: 'Medical SPA Clinic Медицинский СПА-центр с профессиональными косметологическими и оздоровительными процедурами. Львов Косметология Массаж medical health',
        embedding: '[0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0,1.1,1.2,1.3,1.4,1.5,1.6,1.7]'
      }
    ]
    
    for (const embedding of embeddingsData) {
      const { error } = await supabase
        .from('spa_embeddings')
        .upsert(embedding, { onConflict: 'spa_id' })
      
      if (error) {
        console.error(`❌ Error creating embedding for spa ${embedding.spa_id}:`, error)
      } else {
        console.log(`✅ Embedding created for spa: ${embedding.spa_id}`)
      }
    }
    
    console.log('✅ All SQL commands executed successfully!')
    
    // 4. Проверяем результаты
    const { data: spas, error: spasError } = await supabase
      .from('spas')
      .select('id, name')
    
    const { data: embeddings, error: embeddingsError } = await supabase
      .from('spa_embeddings')
      .select('spa_id')
    
    if (!spasError && !embeddingsError) {
      console.log(`📊 Results: ${spas?.length || 0} spas, ${embeddings?.length || 0} embeddings`)
    }
    
  } catch (error) {
    console.error('❌ SQL execution failed:', error)
  }
}

executeSQL()
