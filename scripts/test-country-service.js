// Тест компонента AdminCountryEdit
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'

const supabase = createClient(supabaseUrl, supabaseKey)

// Имитируем countryService
const countryService = {
  async create(country) {
    const { data, error } = await supabase
      .from('countries')
      .insert(country)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

async function testCountryService() {
  try {
    console.log('🔍 Тестируем countryService.create...')
    
    const testData = {
      name: 'Тест через сервис',
      code: 'TSV',
      active: true
    }

    console.log('📝 Данные для создания:', testData)

    const result = await countryService.create(testData)
    console.log('✅ Результат:', result)

    // Удаляем тестовую запись
    await supabase.from('countries').delete().eq('id', result.id)
    console.log('🗑️ Тестовая запись удалена')

  } catch (error) {
    console.error('❌ Ошибка в countryService:', error)
    console.error('Детали:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
  }
}

testCountryService()




