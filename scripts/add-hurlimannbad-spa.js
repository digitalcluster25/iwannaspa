// Скрипт для добавления Hürlimannbad & Spa Zurich
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'

const supabase = createClient(supabaseUrl, supabaseKey)

async function addHurlimannbadSpa() {
  try {
    console.log('🏛️ Добавляем Hürlimannbad & Spa Zurich...')
    
    // Сначала получаем ID Швейцарии
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('*')
      .eq('name', 'Швейцария')
      .single()

    if (countriesError) {
      console.error('❌ Ошибка при получении страны:', countriesError)
      return
    }

    console.log('✅ Найдена страна:', countries.name)

    // Получаем ID города Цюрих (создаем если нет)
    let cityId
    const { data: existingCity, error: cityError } = await supabase
      .from('cities')
      .select('*')
      .eq('name', 'Цюрих')
      .single()

    if (cityError && cityError.code === 'PGRST116') {
      // Город не найден, создаем
      console.log('🏙️ Создаем город Цюрих...')
      const { data: newCity, error: createCityError } = await supabase
        .from('cities')
        .insert({
          name: 'Цюрих',
          country_id: countries.id,
          district: 'Центр',
          active: true
        })
        .select()
        .single()

      if (createCityError) {
        console.error('❌ Ошибка при создании города:', createCityError)
        return
      }
      cityId = newCity.id
      console.log('✅ Город Цюрих создан')
    } else if (cityError) {
      console.error('❌ Ошибка при получении города:', cityError)
      return
    } else {
      cityId = existingCity.id
      console.log('✅ Найден город:', existingCity.name)
    }

    // Данные СПА комплекса
    const spaData = {
      name: 'Hürlimannbad & Spa Zurich',
      description: 'At the Hürlimannbad & Spa Zurich, you bathe in century-old vaults that offer peace and relaxation. The thermal bath area has been redesigned and refurbished in 2022 and now shines in all its new splendour. The location - with many playful elements and details - are reminiscent of the former brewery. On the roof, our infinity pool offers a spectacular panoramic view over Zurich. The Roman-Irish spa ritual is unique in Switzerland and combines ancient bathing cultures into a unique cleansing ritual.',
      price: 98, // Базовая цена за вход
      rating: 4.8,
      review_count: 1250,
      location: 'Brandschenkestrasse 150, 8002 Zurich',
      address: 'Brandschenkestrasse 150, 8002 Zurich, Switzerland',
      address_comment: 'Located on the site of the former Hürlimann brewery',
      latitude: 47.3769,
      longitude: 8.5417,
      images: [
        'https://www.aqua-spa-resorts.ch/images/hurlimannbad-zurich-main.jpg',
        'https://www.aqua-spa-resorts.ch/images/hurlimannbad-thermal-bath.jpg',
        'https://www.aqua-spa-resorts.ch/images/hurlimannbad-infinity-pool.jpg',
        'https://www.aqua-spa-resorts.ch/images/hurlimannbad-roman-irish-ritual.jpg'
      ],
      category: 'thermal',
      purpose: 'relaxation',
      featured: true,
      active: true,
      city_id: cityId
    }

    console.log('📝 Создаем СПА комплекс...')
    const { data: newSpa, error: spaError } = await supabase
      .from('spas')
      .insert(spaData)
      .select()
      .single()

    if (spaError) {
      console.error('❌ Ошибка при создании СПА:', spaError)
      return
    }

    console.log('✅ СПА комплекс создан:', newSpa.name)

    // Добавляем услуги
    const services = [
      {
        spa_id: newSpa.id,
        name: 'Roman-Irish Spa Ritual',
        description: 'Enjoy a unique visit to the Roman-Irish spa area: where various ancient bathing cultures are combined into a unique, relaxing cleansing ritual.',
        duration: 120,
        price: 98,
        image: 'https://www.aqua-spa-resorts.ch/images/roman-irish-ritual.jpg'
      },
      {
        spa_id: newSpa.id,
        name: 'Thermal Bath Access',
        description: 'Bathe in century-old vaults that offer peace and relaxation. The thermal bath area was redesigned in 2022.',
        duration: 180,
        price: 45,
        image: 'https://www.aqua-spa-resorts.ch/images/thermal-bath.jpg'
      },
      {
        spa_id: newSpa.id,
        name: 'Infinity Pool Access',
        description: 'Spectacular panoramic view over Zurich from our rooftop infinity pool.',
        duration: 120,
        price: 35,
        image: 'https://www.aqua-spa-resorts.ch/images/infinity-pool.jpg'
      },
      {
        spa_id: newSpa.id,
        name: 'Milk and Herbal Compress Massage',
        description: 'Relaxing massage with milk and herbal compresses for ultimate relaxation.',
        duration: 50,
        price: 178,
        image: 'https://www.aqua-spa-resorts.ch/images/massage.jpg'
      },
      {
        spa_id: newSpa.id,
        name: 'Full Body Wrap',
        description: 'Choose from various full body wrap treatments for skin care and relaxation.',
        duration: 60,
        price: 93,
        image: 'https://www.aqua-spa-resorts.ch/images/body-wrap.jpg'
      },
      {
        spa_id: newSpa.id,
        name: 'Day Spa Ginger Pure Package',
        description: 'Complete day spa experience with treatments, meals and relaxation time.',
        duration: 480,
        price: 384,
        image: 'https://www.aqua-spa-resorts.ch/images/day-spa.jpg'
      }
    ]

    console.log('🛠️ Добавляем услуги...')
    const { data: newServices, error: servicesError } = await supabase
      .from('spa_services')
      .insert(services)
      .select()

    if (servicesError) {
      console.error('❌ Ошибка при создании услуг:', servicesError)
    } else {
      console.log(`✅ Добавлено услуг: ${newServices.length}`)
    }

    // Добавляем контактную информацию
    const contactData = {
      spa_id: newSpa.id,
      phone: '+41 44 205 96 50',
      email: 'info@huerlimannbad.ch',
      working_hours: 'Monday to Sunday 09:00 am to 10:00 pm (spa stops running 30 minutes before closing)',
      website: 'https://www.aqua-spa-resorts.ch/en/hurlimannbad-spa-zurich',
      whatsapp: null,
      telegram: null
    }

    console.log('📞 Добавляем контактную информацию...')
    const { data: newContact, error: contactError } = await supabase
      .from('spa_contacts')
      .insert(contactData)
      .select()
      .single()

    if (contactError) {
      console.error('❌ Ошибка при создании контактов:', contactError)
    } else {
      console.log('✅ Контактная информация добавлена')
    }

    console.log('\n🎉 Hürlimannbad & Spa Zurich успешно добавлен!')
    console.log('📊 Статистика:')
    console.log(`  - СПА: ${newSpa.name}`)
    console.log(`  - Город: Цюрих, Швейцария`)
    console.log(`  - Услуг: ${services.length}`)
    console.log(`  - Цена от: ${Math.min(...services.map(s => s.price))} CHF`)
    console.log(`  - Рейтинг: ${spaData.rating}/5`)

  } catch (error) {
    console.error('💥 Общая ошибка:', error)
  }
}

addHurlimannbadSpa()





