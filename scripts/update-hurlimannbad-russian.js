// Скрипт для обновления Hürlimannbad & Spa Zurich на русский язык
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'

const supabase = createClient(supabaseUrl, supabaseKey)

// Курс швейцарского франка к гривне (примерно 52 грн за 1 CHF)
const CHF_TO_UAH_RATE = 52

async function updateHurlimannbadSpa() {
  try {
    console.log('🇷🇺 Обновляем Hürlimannbad & Spa Zurich на русский язык...')
    
    // Находим СПА комплекс
    const { data: spas, error: spaError } = await supabase
      .from('spas')
      .select('*')
      .eq('name', 'Hürlimannbad & Spa Zurich')
      .single()

    if (spaError) {
      console.error('❌ Ошибка при поиске СПА:', spaError)
      return
    }

    console.log('✅ Найден СПА:', spas.name)

    // Обновляем основную информацию СПА на русский
    const updatedSpaData = {
      name: 'Хюрлиманнбад & СПА Цюрих',
      description: 'В Хюрлиманнбад & СПА Цюрих вы купаетесь в вековых сводах, которые предлагают покой и расслабление. Термальная зона была переработана и отремонтирована в 2022 году и теперь сияет во всей своей новой красоте. Местоположение - с множеством игривых элементов и деталей - напоминает о бывшей пивоварне. На крыше наш бесконечный бассейн предлагает захватывающий панорамный вид на Цюрих. Римско-ирландский СПА ритуал уникален в Швейцарии и сочетает древние культуры купания в уникальный очищающий ритуал.',
      price: Math.round(98 * CHF_TO_UAH_RATE), // 98 CHF * 52 = 5096 грн
      location: 'Брандшенкештрассе 150, 8002 Цюрих',
      address: 'Брандшенкештрассе 150, 8002 Цюрих, Швейцария',
      address_comment: 'Расположен на месте бывшей пивоварни Хюрлиманн'
    }

    console.log('📝 Обновляем основную информацию СПА...')
    const { data: updatedSpa, error: updateSpaError } = await supabase
      .from('spas')
      .update(updatedSpaData)
      .eq('id', spas.id)
      .select()
      .single()

    if (updateSpaError) {
      console.error('❌ Ошибка при обновлении СПА:', updateSpaError)
      return
    }

    console.log('✅ СПА обновлен:', updatedSpa.name)

    // Обновляем услуги на русский язык с пересчетом цен
    const servicesUpdates = [
      {
        name: 'Римско-ирландский СПА ритуал',
        description: 'Насладитесь уникальным посещением римско-ирландской СПА зоны: где различные древние культуры купания объединены в уникальный, расслабляющий очищающий ритуал.',
        price: Math.round(98 * CHF_TO_UAH_RATE) // 5096 грн
      },
      {
        name: 'Доступ к термальным ваннам',
        description: 'Купайтесь в вековых сводах, которые предлагают покой и расслабление. Термальная зона была переработана в 2022 году.',
        price: Math.round(45 * CHF_TO_UAH_RATE) // 2340 грн
      },
      {
        name: 'Доступ к бесконечному бассейну',
        description: 'Захватывающий панорамный вид на Цюрих с нашего крышного бесконечного бассейна.',
        price: Math.round(35 * CHF_TO_UAH_RATE) // 1820 грн
      },
      {
        name: 'Массаж с молочными и травяными компрессами',
        description: 'Расслабляющий массаж с молочными и травяными компрессами для максимального расслабления.',
        price: Math.round(178 * CHF_TO_UAH_RATE) // 9256 грн
      },
      {
        name: 'Полное обертывание тела',
        description: 'Выберите из различных процедур полного обертывания тела для ухода за кожей и расслабления.',
        price: Math.round(93 * CHF_TO_UAH_RATE) // 4836 грн
      },
      {
        name: 'Дневной СПА пакет Ginger Pure',
        description: 'Полный дневной СПА опыт с процедурами, питанием и временем для расслабления.',
        price: Math.round(384 * CHF_TO_UAH_RATE) // 19968 грн
      }
    ]

    console.log('🛠️ Обновляем услуги...')
    
    // Получаем все услуги для этого СПА
    const { data: existingServices, error: servicesError } = await supabase
      .from('spa_services')
      .select('*')
      .eq('spa_id', spas.id)
      .order('id')

    if (servicesError) {
      console.error('❌ Ошибка при получении услуг:', servicesError)
      return
    }

    // Обновляем каждую услугу
    for (let i = 0; i < existingServices.length && i < servicesUpdates.length; i++) {
      const service = existingServices[i]
      const update = servicesUpdates[i]
      
      const { error: updateServiceError } = await supabase
        .from('spa_services')
        .update({
          name: update.name,
          description: update.description,
          price: update.price
        })
        .eq('id', service.id)

      if (updateServiceError) {
        console.error(`❌ Ошибка при обновлении услуги ${service.name}:`, updateServiceError)
      } else {
        console.log(`✅ Обновлена услуга: ${update.name} - ${update.price} грн`)
      }
    }

    // Обновляем контактную информацию на русский
    const contactUpdate = {
      working_hours: 'Понедельник - воскресенье с 09:00 до 22:00 (СПА останавливается за 30 минут до закрытия)'
    }

    console.log('📞 Обновляем контактную информацию...')
    const { error: contactError } = await supabase
      .from('spa_contacts')
      .update(contactUpdate)
      .eq('spa_id', spas.id)

    if (contactError) {
      console.error('❌ Ошибка при обновлении контактов:', contactError)
    } else {
      console.log('✅ Контактная информация обновлена')
    }

    console.log('\n🎉 Hürlimannbad & Spa Zurich успешно обновлен на русский язык!')
    console.log('📊 Статистика обновления:')
    console.log(`  - СПА: ${updatedSpa.name}`)
    console.log(`  - Базовая цена: ${updatedSpaData.price} грн (было 98 CHF)`)
    console.log(`  - Курс: ${CHF_TO_UAH_RATE} грн за 1 CHF`)
    console.log(`  - Обновлено услуг: ${servicesUpdates.length}`)
    console.log(`  - Цены услуг: от ${Math.min(...servicesUpdates.map(s => s.price))} до ${Math.max(...servicesUpdates.map(s => s.price))} грн`)

  } catch (error) {
    console.error('💥 Общая ошибка:', error)
  }
}

updateHurlimannbadSpa()





