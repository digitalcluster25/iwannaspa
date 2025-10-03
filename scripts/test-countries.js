// Тестовый скрипт для проверки работы с странами
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCountries() {
  try {
    console.log('🔍 Проверяем подключение к Supabase...')
    
    // Проверяем существующие страны
    const { data: countries, error: fetchError } = await supabase
      .from('countries')
      .select('*')

    if (fetchError) {
      console.error('❌ Ошибка при загрузке стран:', fetchError)
      return
    }

    console.log(`✅ Подключение успешно! Найдено стран: ${countries?.length || 0}`)
    
    if (countries && countries.length > 0) {
      console.log('🌍 Существующие страны:')
      countries.forEach(country => {
        console.log(`  - ${country.name} (${country.code}) - ${country.active ? 'активна' : 'неактивна'}`)
      })
    } else {
      console.log('⚠️ Страны не найдены. Попробуем создать тестовую...')
      
      // Создаем тестовую страну
      const { data: newCountry, error: createError } = await supabase
        .from('countries')
        .insert({
          name: 'Тестовая страна',
          code: 'TS',
          active: true
        })
        .select()
        .single()

      if (createError) {
        console.error('❌ Ошибка при создании тестовой страны:', createError)
      } else {
        console.log('✅ Тестовая страна создана:', newCountry)
      }
    }

    // Проверяем города
    console.log('\n🏙️ Проверяем города...')
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select(`
        *,
        country:countries(*)
      `)

    if (citiesError) {
      console.error('❌ Ошибка при загрузке городов:', citiesError)
    } else {
      console.log(`✅ Найдено городов: ${cities?.length || 0}`)
      if (cities && cities.length > 0) {
        cities.forEach(city => {
          console.log(`  - ${city.name}${city.country ? ` (${city.country.name})` : ' (без страны)'}`)
        })
      }
    }

  } catch (error) {
    console.error('💥 Общая ошибка:', error)
  }
}

testCountries()




