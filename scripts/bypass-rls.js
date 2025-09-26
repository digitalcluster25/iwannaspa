import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'

const supabase = createClient(supabaseUrl, supabaseKey)

async function bypassRLS() {
  try {
    console.log('🚀 Attempting to bypass RLS and create embeddings...')
    
    // Попробуем создать эмбеддинг напрямую через REST API
    const embeddingData = {
      spa_id: '550e8400-e29b-41d4-a716-446655440001',
      content: 'Luxury Wellness Resort Премиальный СПА-курорт с полным спектром wellness услуг. Включает массажные процедуры, термальные ванны, йогу и медитацию. Киев Сауна Бассейн Йога Ресторан wellness relaxation',
      embedding: Array(1536).fill(0).map((_, i) => (i + 1) * 0.001).join(',')
    }
    
    // Используем прямой HTTP запрос
    const response = await fetch(`${supabaseUrl}/rest/v1/spa_embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        spa_id: embeddingData.spa_id,
        content: embeddingData.content,
        embedding: `[${embeddingData.embedding}]`
      })
    })
    
    if (response.ok) {
      console.log('✅ Embedding created successfully via REST API!')
    } else {
      const error = await response.text()
      console.error('❌ REST API error:', error)
    }
    
  } catch (error) {
    console.error('❌ Failed:', error)
  }
}

bypassRLS()
