// Скрипт для проверки обновленных данных Hürlimannbad & Spa Zurich
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkHurlimannbadData() {
  try {
    console.log('🔍 Проверяем данные Hürlimannbad & Spa Zurich...')
    
    // Проверяем основную информацию СПА
    const { data: spa, error: spaError } = await supabase
      .from('spas')
      .select(`
        *,
        city:cities(*)
      `)
      .ilike('name', '%хюрлиманнбад%')
      .single()

    if (spaError) {
      console.error('❌ Ошибка при поиске СПА:', spaError)
      return
    }

    console.log('\n📋 Основная информация СПА:')
    console.log(`  Название: ${spa.name}`)
    console.log(`  Описание: ${spa.description.substring(0, 100)}...`)
    console.log(`  Цена: ${spa.price} грн`)
    console.log(`  Рейтинг: ${spa.rating}/5`)
    console.log(`  Адрес: ${spa.address}`)
    console.log(`  Город: ${spa.city?.name || 'Не указан'}`)
    console.log(`  Район: ${spa.city?.district || 'Не указан'}`)

    // Проверяем услуги
    const { data: services, error: servicesError } = await supabase
      .from('spa_services')
      .select('*')
      .eq('spa_id', spa.id)
      .order('price')

    if (servicesError) {
      console.error('❌ Ошибка при получении услуг:', servicesError)
    } else {
      console.log('\n🛠️ Услуги СПА:')
      services.forEach((service, index) => {
        console.log(`  ${index + 1}. ${service.name}`)
        console.log(`     Цена: ${service.price} грн`)
        console.log(`     Длительность: ${service.duration} мин`)
        console.log(`     Описание: ${service.description.substring(0, 80)}...`)
        console.log('')
      })
    }

    // Проверяем контакты
    const { data: contact, error: contactError } = await supabase
      .from('spa_contacts')
      .select('*')
      .eq('spa_id', spa.id)
      .single()

    if (contactError) {
      console.error('❌ Ошибка при получении контактов:', contactError)
    } else {
      console.log('📞 Контактная информация:')
      console.log(`  Телефон: ${contact.phone}`)
      console.log(`  Email: ${contact.email}`)
      console.log(`  Часы работы: ${contact.working_hours}`)
      console.log(`  Сайт: ${contact.website}`)
    }

    console.log('\n✅ Проверка завершена успешно!')

  } catch (error) {
    console.error('💥 Общая ошибка:', error)
  }
}

checkHurlimannbadData()
