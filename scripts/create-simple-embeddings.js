import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createSimpleEmbeddings() {
  try {
    console.log('🚀 Creating simple test embeddings...')
    
    // Создаем простые тестовые эмбеддинги (1536 измерений)
    const embeddings = [
      {
        spa_id: '550e8400-e29b-41d4-a716-446655440001',
        content: 'Luxury Wellness Resort Премиальный СПА-курорт с полным спектром wellness услуг. Включает массажные процедуры, термальные ванны, йогу и медитацию. Киев Сауна Бассейн Йога Ресторан wellness relaxation',
        embedding: Array(1536).fill(0).map((_, i) => (i + 1) * 0.001).join(',')
      },
      {
        spa_id: '550e8400-e29b-41d4-a716-446655440002', 
        content: 'Термальный комплекс "Источник" Уникальный термальный СПА-комплекс с естественными горячими источниками и лечебными процедурами. Буковель Термальные ванны Грязелечение Сауна thermal health',
        embedding: Array(1536).fill(0).map((_, i) => (i + 2) * 0.001).join(',')
      },
      {
        spa_id: '550e8400-e29b-41d4-a716-446655440003',
        content: 'Medical SPA Clinic Медицинский СПА-центр с профессиональными косметологическими и оздоровительными процедурами. Львов Косметология Массаж medical health',
        embedding: Array(1536).fill(0).map((_, i) => (i + 3) * 0.001).join(',')
      }
    ]
    
    for (const emb of embeddings) {
      const { error } = await supabase
        .from('spa_embeddings')
        .upsert({
          spa_id: emb.spa_id,
          content: emb.content,
          embedding: `[${emb.embedding}]`
        }, { onConflict: 'spa_id' })
      
      if (error) {
        console.error(`❌ Error creating embedding for ${emb.spa_id}:`, error)
      } else {
        console.log(`✅ Embedding created for spa: ${emb.spa_id}`)
      }
    }
    
    console.log('✅ All test embeddings created!')
    
    // Тестируем поиск
    console.log('🔍 Testing search...')
    const testEmbedding = Array(1536).fill(0).map((_, i) => (i + 1) * 0.001).join(',')
    
    const { data: results, error } = await supabase
      .rpc('search_spas', {
        query_embedding: `[${testEmbedding}]`,
        match_threshold: 0.1,
        match_count: 5
      })
    
    if (error) {
      console.error('❌ Search test error:', error)
    } else {
      console.log(`🔍 Search returned ${results?.length || 0} results`)
      results?.forEach((result, i) => {
        console.log(`  ${i + 1}. Spa ID: ${result.spa_id}, Similarity: ${(result.similarity * 100).toFixed(1)}%`)
      })
    }
    
  } catch (error) {
    console.error('❌ Failed:', error)
  }
}

createSimpleEmbeddings()
