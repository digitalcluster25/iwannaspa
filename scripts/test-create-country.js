// Тестовый скрипт для проверки создания страны
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCreateCountry() {
  try {
    console.log('🔍 Тестируем создание страны...')
    
    // Пробуем создать тестовую страну
    const testCountry = {
      name: 'Тестовая страна ' + Date.now(),
      code: 'TS' + Math.floor(Math.random() * 100),
      active: true
    }

    console.log('📝 Создаем страну:', testCountry)

    const { data: newCountry, error } = await supabase
      .from('countries')
      .insert(testCountry)
      .select()
      .single()

    if (error) {
      console.error('❌ Ошибка при создании страны:', error)
      console.error('Детали ошибки:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
    } else {
      console.log('✅ Страна успешно создана:', newCountry)
      
      // Удаляем тестовую страну
      const { error: deleteError } = await supabase
        .from('countries')
        .delete()
        .eq('id', newCountry.id)

      if (deleteError) {
        console.error('⚠️ Ошибка при удалении тестовой страны:', deleteError)
      } else {
        console.log('🗑️ Тестовая страна удалена')
      }
    }

    // Проверяем права доступа
    console.log('\n🔒 Проверяем права доступа...')
    const { data: policies, error: policiesError } = await supabase
      .from('information_schema.table_privileges')
      .select('*')
      .eq('table_name', 'countries')

    if (policiesError) {
      console.log('⚠️ Не удалось проверить политики:', policiesError.message)
    } else {
      console.log('📋 Политики доступа:', policies?.length || 0)
    }

  } catch (error) {
    console.error('💥 Общая ошибка:', error)
  }
}

testCreateCountry()




