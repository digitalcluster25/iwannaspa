import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

const spaId = 'e68aea4d-aff1-4b14-812c-65bdc11eb8a9'

console.log('🔍 Проверка удобств для СПА:', spaId)
console.log('')

// 1. Проверяем СПА
const { data: spa, error: spaError } = await supabase
  .from('spas')
  .select('id, name')
  .eq('id', spaId)
  .single()

if (spaError) {
  console.error('❌ Ошибка загрузки СПА:', spaError.message)
  process.exit(1)
}

console.log('✅ СПА найден:', spa.name)
console.log('')

// 2. Проверяем связи spa_amenities
console.log('📋 Проверка таблицы spa_amenities:')
const { data: spaAmenities, error: amenitiesError } = await supabase
  .from('spa_amenities')
  .select('*')
  .eq('spa_id', spaId)

if (amenitiesError) {
  console.error('❌ Ошибка:', amenitiesError.message)
} else {
  console.log(`   Найдено записей: ${spaAmenities.length}`)
  if (spaAmenities.length > 0) {
    console.log('   Данные:', JSON.stringify(spaAmenities, null, 2))
  } else {
    console.log('   ⚠️  Записей нет - удобства не сохранены!')
  }
}
console.log('')

// 3. Проверяем все удобства в системе
console.log('📚 Все удобства в системе:')
const { data: allAmenities } = await supabase
  .from('amenities')
  .select('*')
  .eq('active', true)

if (allAmenities && allAmenities.length > 0) {
  console.log(`   Всего активных: ${allAmenities.length}`)
  allAmenities.slice(0, 5).forEach(a => {
    console.log(`   - ${a.name} (ID: ${a.id})`)
  })
  if (allAmenities.length > 5) {
    console.log(`   ... и еще ${allAmenities.length - 5}`)
  }
} else {
  console.log('   ❌ Удобства не найдены!')
}
console.log('')

// 4. Проверяем полный запрос как в приложении
console.log('🔗 Полный запрос (как в приложении):')
const { data: fullData, error: fullError } = await supabase
  .from('spas')
  .select(`
    id,
    name,
    amenities:spa_amenities(
      amenity:amenities(*)
    )
  `)
  .eq('id', spaId)
  .single()

if (fullError) {
  console.error('❌ Ошибка:', fullError.message)
} else {
  console.log('   Результат:')
  console.log(JSON.stringify(fullData, null, 2))
}
