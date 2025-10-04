// Скрипт для проверки и создания таблицы countries
import { createClient } from '@supabase/supabase-js'

// Получаем переменные окружения из .env файла
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Отсутствуют переменные окружения Supabase')
  console.log('Убедитесь, что в файле .env есть:')
  console.log('VITE_SUPABASE_URL=your_supabase_url')
  console.log('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAndCreateCountriesTable() {
  try {
    console.log('🔍 Проверяем подключение к Supabase...')
    
    // Проверяем, существует ли таблица countries
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'countries')

    if (tablesError) {
      console.error('❌ Ошибка при проверке таблиц:', tablesError)
      return
    }

    if (tables && tables.length > 0) {
      console.log('✅ Таблица countries уже существует')
      
      // Проверяем, есть ли данные
      const { data: countries, error: countriesError } = await supabase
        .from('countries')
        .select('*')

      if (countriesError) {
        console.error('❌ Ошибка при загрузке стран:', countriesError)
        return
      }

      console.log(`📊 Найдено стран: ${countries?.length || 0}`)
      if (countries && countries.length > 0) {
        console.log('🌍 Страны:', countries.map(c => `${c.name} (${c.code})`).join(', '))
      }
    } else {
      console.log('⚠️ Таблица countries не найдена')
      console.log('📋 Выполните миграцию из файла MIGRATION_INSTRUCTIONS.md')
    }

  } catch (error) {
    console.error('💥 Ошибка:', error)
  }
}

checkAndCreateCountriesTable()





