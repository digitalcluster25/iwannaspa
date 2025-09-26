import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'

const supabase = createClient(supabaseUrl, supabaseKey)

const mockCities = [
  { name: 'Киев', active: true },
  { name: 'Одесса', active: true },
  { name: 'Львов', active: true },
  { name: 'Харьков', active: true },
  { name: 'Днепр', active: true },
]

const mockCategories = [
  { name: 'Wellness', value: 'wellness', active: true },
  { name: 'Medical', value: 'medical', active: true },
  { name: 'Luxury', value: 'luxury', active: true },
  { name: 'Family', value: 'family', active: true },
]

const mockPurposes = [
  { name: 'Релаксация', value: 'relaxation', active: true },
  { name: 'Лечение', value: 'treatment', active: true },
  { name: 'Детокс', value: 'detox', active: true },
  { name: 'Спорт', value: 'sport', active: true },
]

const mockAmenities = [
  { name: 'Бассейн', active: true },
  { name: 'Сауна', active: true },
  { name: 'Хамам', active: true },
  { name: 'Джакузи', active: true },
  { name: 'Фитнес-зал', active: true },
  { name: 'Массажные кабинеты', active: true },
  { name: 'Парковка', active: true },
  { name: 'Wi-Fi', active: true },
  { name: 'Ресторан', active: true },
  { name: 'Бар', active: true },
]

const mockServiceTemplates = [
  { name: 'Массаж', active: true },
  { name: 'Обертывание', active: true },
  { name: 'Пилинг', active: true },
  { name: 'Маска для лица', active: true },
  { name: 'Маникюр', active: true },
  { name: 'Педикюр', active: true },
  { name: 'Стрижка', active: true },
  { name: 'Окрашивание', active: true },
]

const mockSpas = [
  {
    name: 'Luxury Wellness Resort',
    description: 'Премиальный wellness-комплекс с современным оборудованием',
    location: 'Киев',
    category: 'luxury',
    purpose: 'relaxation',
    price: 3500,
    rating: 4.9,
    reviewCount: 248,
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f'
    ],
    amenities: ['Бассейн', 'Сауна', 'Джакузи', 'Фитнес-зал', 'Ресторан', 'Парковка', 'Wi-Fi'],
    services: [
      { name: 'Массаж', description: 'Расслабляющий массаж всего тела', price: 1200, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874' },
      { name: 'Обертывание', description: 'Детокс обертывание', price: 900, image: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea' }
    ],
    contactInfo: {
      phone: '+380 44 123 45 67',
      email: 'info@luxuryspa.ua',
      workingHours: 'Пн-Вс 9:00 - 22:00',
      whatsapp: '+380 44 123 45 67',
      telegram: '@luxuryspa'
    },
    featured: true,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    name: 'Medical SPA Clinic',
    description: 'Медицинский СПА-центр с лечебными процедурами',
    location: 'Одесса',
    category: 'medical',
    purpose: 'treatment',
    price: 2800,
    rating: 4.8,
    reviewCount: 189,
    images: [
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1',
      'https://images.unsplash.com/photo-1591343395902-73524b7b2e19'
    ],
    amenities: ['Бассейн', 'Сауна', 'Массажные кабинеты', 'Парковка', 'Wi-Fi'],
    services: [
      { name: 'Лечебный массаж', description: 'Медицинский массаж', price: 1500, image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1' }
    ],
    contactInfo: {
      phone: '+380 48 765 43 21',
      email: 'info@medicalspa.ua',
      workingHours: 'Пн-Пт 8:00 - 20:00',
    },
    featured: true,
    active: true,
    createdAt: new Date().toISOString()
  }
]

async function migrate() {
  console.log('🚀 Начинаем миграцию данных в Supabase...\n')

  try {
    // 1. Города
    console.log('📍 Миграция городов...')
    for (const city of mockCities) {
      const { error } = await supabase
        .from('cities')
        .upsert(city, { onConflict: 'name' })
      
      if (!error) console.log(`  ✅ ${city.name}`)
      else console.error(`  ❌ ${city.name}:`, error.message)
    }

    // 2. Категории
    console.log('\n📂 Миграция категорий...')
    for (const cat of mockCategories) {
      const { error } = await supabase
        .from('categories')
        .upsert({ ...cat, label: cat.name }, { onConflict: 'value' })
      
      if (!error) console.log(`  ✅ ${cat.name}`)
      else console.error(`  ❌ ${cat.name}:`, error.message)
    }

    // 3. Назначения
    console.log('\n🎯 Миграция назначений...')
    for (const purpose of mockPurposes) {
      const { error } = await supabase
        .from('purposes')
        .upsert({ ...purpose, label: purpose.name }, { onConflict: 'value' })
      
      if (!error) console.log(`  ✅ ${purpose.name}`)
      else console.error(`  ❌ ${purpose.name}:`, error.message)
    }

    // 4. Удобства
    console.log('\n✨ Миграция удобств...')
    for (const amenity of mockAmenities) {
      const { error } = await supabase
        .from('amenities')
        .upsert(amenity, { onConflict: 'name' })
      
      if (!error) console.log(`  ✅ ${amenity.name}`)
      else console.error(`  ❌ ${amenity.name}:`, error.message)
    }

    // 5. Шаблоны услуг
    console.log('\n🛠️ Миграция шаблонов услуг...')
    for (const service of mockServiceTemplates) {
      const { error } = await supabase
        .from('service_templates')
        .upsert(service, { onConflict: 'name' })
      
      if (!error) console.log(`  ✅ ${service.name}`)
      else console.error(`  ❌ ${service.name}:`, error.message)
    }

    // Получаем ID для связей
    const { data: cities } = await supabase.from('cities').select('id, name')
    const cityMap = new Map(cities?.map(c => [c.name, c.id]) || [])

    const { data: amenities } = await supabase.from('amenities').select('id, name')
    const amenityMap = new Map(amenities?.map(a => [a.name, a.id]) || [])

    // 6. СПА
    console.log('\n🏨 Миграция СПА комплексов...')
    for (const spa of mockSpas) {
      const { data: spaData, error: spaError } = await supabase
        .from('spas')
        .insert({
          name: spa.name,
          description: spa.description,
          price: spa.price,
          rating: spa.rating,
          review_count: spa.reviewCount,
          location: spa.location,
          city_id: cityMap.get(spa.location),
          images: spa.images,
          category: spa.category,
          purpose: spa.purpose,
          featured: spa.featured,
          active: spa.active,
          created_at: spa.createdAt
        })
        .select()
        .single()
      
      if (spaError) {
        console.error(`  ❌ ${spa.name}:`, spaError.message)
        continue
      }

      console.log(`  ✅ ${spa.name}`)

      // Услуги
      if (spa.services?.length > 0) {
        await supabase.from('spa_services').insert(
          spa.services.map(s => ({
            spa_id: spaData.id,
            name: s.name,
            description: s.description,
            price: s.price,
            image: s.image
          }))
        )
        console.log(`    ✅ Услуги: ${spa.services.length}`)
      }

      // Удобства
      if (spa.amenities?.length > 0) {
        const amenityIds = spa.amenities.map(name => amenityMap.get(name)).filter(Boolean)
        if (amenityIds.length > 0) {
          await supabase.from('spa_amenities').insert(
            amenityIds.map(id => ({ spa_id: spaData.id, amenity_id: id }))
          )
          console.log(`    ✅ Удобства: ${amenityIds.length}`)
        }
      }

      // Контакты
      if (spa.contactInfo) {
        await supabase.from('spa_contacts').insert({
          spa_id: spaData.id,
          phone: spa.contactInfo.phone,
          email: spa.contactInfo.email,
          working_hours: spa.contactInfo.workingHours,
          whatsapp: spa.contactInfo.whatsapp,
          telegram: spa.contactInfo.telegram
        })
        console.log(`    ✅ Контакты`)
      }
    }

    console.log('\n✨ Миграция завершена!')
    console.log('\n📊 Статистика:')
    console.log(`  • Городов: ${mockCities.length}`)
    console.log(`  • Категорий: ${mockCategories.length}`)
    console.log(`  • Назначений: ${mockPurposes.length}`)
    console.log(`  • Удобств: ${mockAmenities.length}`)
    console.log(`  • Услуг: ${mockServiceTemplates.length}`)
    console.log(`  • СПА: ${mockSpas.length}`)

  } catch (error) {
    console.error('\n❌ Ошибка:', error)
    process.exit(1)
  }
}

migrate()
