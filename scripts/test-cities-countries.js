// Тест работы с городами и странами
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCitiesAndCountries() {
  try {
    console.log('🔍 Тестируем работу с городами и странами...')
    
    // 1. Получаем список стран
    console.log('\n🌍 Получаем список стран...')
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('*')
      .order('name')

    if (countriesError) {
      console.error('❌ Ошибка при загрузке стран:', countriesError)
      return
    }

    console.log(`✅ Найдено стран: ${countries.length}`)
    countries.forEach(country => {
      console.log(`  - ${country.name} (${country.code})`)
    })

    if (countries.length === 0) {
      console.log('⚠️ Нет стран для тестирования')
      return
    }

    // 2. Получаем список городов
    console.log('\n🏙️ Получаем список городов...')
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select(`
        *,
        country:countries(*)
      `)
      .order('name')

    if (citiesError) {
      console.error('❌ Ошибка при загрузке городов:', citiesError)
      return
    }

    console.log(`✅ Найдено городов: ${cities.length}`)
    cities.forEach(city => {
      console.log(`  - ${city.name}${city.country ? ` (${city.country.name})` : ' (без страны)'}`)
    })

    // 3. Тестируем создание города с привязкой к стране
    console.log('\n➕ Тестируем создание города с привязкой к стране...')
    const firstCountry = countries[0]
    
    const testCity = {
      name: `Тестовый город ${Date.now()}`,
      country_id: firstCountry.id,
      active: true
    }

    console.log('📝 Создаем город:', testCity)

    const { data: newCity, error: createError } = await supabase
      .from('cities')
      .insert(testCity)
      .select(`
        *,
        country:countries(*)
      `)
      .single()

    if (createError) {
      console.error('❌ Ошибка при создании города:', createError)
    } else {
      console.log('✅ Город создан:', {
        name: newCity.name,
        country: newCity.country?.name || 'без страны'
      })

      // 4. Тестируем обновление города (смена страны)
      console.log('\n✏️ Тестируем обновление города (смена страны)...')
      
      const secondCountry = countries[1] || countries[0]
      
      const { data: updatedCity, error: updateError } = await supabase
        .from('cities')
        .update({ country_id: secondCountry.id })
        .eq('id', newCity.id)
        .select(`
          *,
          country:countries(*)
        `)
        .single()

      if (updateError) {
        console.error('❌ Ошибка при обновлении города:', updateError)
      } else {
        console.log('✅ Город обновлен:', {
          name: updatedCity.name,
          oldCountry: firstCountry.name,
          newCountry: updatedCity.country?.name || 'без страны'
        })
      }

      // 5. Удаляем тестовый город
      console.log('\n🗑️ Удаляем тестовый город...')
      const { error: deleteError } = await supabase
        .from('cities')
        .delete()
        .eq('id', newCity.id)

      if (deleteError) {
        console.error('⚠️ Ошибка при удалении тестового города:', deleteError)
      } else {
        console.log('✅ Тестовый город удален')
      }
    }

  } catch (error) {
    console.error('💥 Общая ошибка:', error)
  }
}

testCitiesAndCountries()





