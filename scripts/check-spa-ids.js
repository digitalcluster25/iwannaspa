import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Отсутствуют переменные окружения VITE_SUPABASE_URL или VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSpaIds() {
  console.log('🔍 Проверяем существующие ID в таблице spas...')
  
  const { data: spas, error } = await supabase
    .from('spas')
    .select('id, name')
  
  if (error) {
    console.error('❌ Ошибка при получении данных:', error)
    return
  }
  
  console.log('📋 Найденные СПА:')
  spas.forEach(spa => {
    console.log(`  - ID: ${spa.id}`)
    console.log(`    Название: ${spa.name}`)
    console.log('')
  })
  
  if (spas.length === 0) {
    console.log('⚠️  Таблица spas пуста!')
  }
}

checkSpaIds()
