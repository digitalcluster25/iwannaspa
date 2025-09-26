// Прямой запуск миграции без npm
import('./src/lib/supabase.js').then(({ supabase }) => {
  import('./src/data/mockData.js').then(async ({ 
    mockSpas, 
    mockCities, 
    mockCategories, 
    mockPurposes, 
    mockAmenities,
    mockServiceTemplates
  }) => {
    console.log('🚀 Начинаем миграцию данных в Supabase...\n')

    try {
      // 1. Мигрируем города
      console.log('📍 Миграция городов...')
      for (const city of mockCities) {
        const { error } = await supabase
          .from('cities')
          .upsert({ 
            name: city.name, 
            active: city.active 
          }, { 
            onConflict: 'name' 
          })
        
        if (error) {
          console.error(`  ❌ Ошибка для города ${city.name}:`, error.message)
        } else {
          console.log(`  ✅ ${city.name}`)
        }
      }

      // 2. Мигрируем категории
      console.log('\n📂 Миграция категорий...')
      for (const category of mockCategories) {
        const { error } = await supabase
          .from('categories')
          .upsert({ 
            name: category.name,
            label: category.name,
            value: category.value, 
            active: category.active 
          }, { 
            onConflict: 'value' 
          })
        
        if (error) {
          console.error(`  ❌ Ошибка для категории ${category.name}:`, error.message)
        } else {
          console.log(`  ✅ ${category.name}`)
        }
      }

      // 3. Мигрируем назначения
      console.log('\n🎯 Миграция назначений...')
      for (const purpose of mockPurposes) {
        const { error } = await supabase
          .from('purposes')
          .upsert({ 
            name: purpose.name,
            label: purpose.name,
            value: purpose.value, 
            active: purpose.active 
          }, { 
            onConflict: 'value' 
          })
        
        if (error) {
          console.error(`  ❌ Ошибка для назначения ${purpose.name}:`, error.message)
        } else {
          console.log(`  ✅ ${purpose.name}`)
        }
      }

      // 4. Мигрируем удобства
      console.log('\n✨ Миграция удобств...')
      for (const amenity of mockAmenities) {
        const { error } = await supabase
          .from('amenities')
          .upsert({ 
            name: amenity.name, 
            active: amenity.active 
          }, { 
            onConflict: 'name' 
          })
        
        if (error) {
          console.error(`  ❌ Ошибка для удобства ${amenity.name}:`, error.message)
        } else {
          console.log(`  ✅ ${amenity.name}`)
        }
      }

      // 5. Мигрируем шаблоны услуг
      console.log('\n🛠️ Миграция шаблонов услуг...')
      for (const service of mockServiceTemplates) {
        const { error } = await supabase
          .from('service_templates')
          .upsert({ 
            name: service.name, 
            active: service.active 
          }, { 
            onConflict: 'name' 
          })
        
        if (error) {
          console.error(`  ❌ Ошибка для услуги ${service.name}:`, error.message)
        } else {
          console.log(`  ✅ ${service.name}`)
        }
      }

      // Получаем ID городов для связи
      const { data: cities } = await supabase.from('cities').select('id, name')
      const cityMap = new Map(cities?.map(c => [c.name, c.id]) || [])

      // Получаем ID удобств
      const { data: amenities } = await supabase.from('amenities').select('id, name')
      const amenityMap = new Map(amenities?.map(a => [a.name, a.id]) || [])

      // 6. Мигрируем СПА
      console.log('\n🏨 Миграция СПА комплексов...')
      for (const spa of mockSpas) {
        try {
          // Создаем СПА
          const { data: spaData, error: spaError } = await supabase
            .from('spas')
            .insert({
              name: spa.name,
              description: spa.description,
              price: spa.price,
              rating: spa.rating,
              review_count: spa.reviewCount,
              location: spa.location,
              city_id: cityMap.get(spa.location) || null,
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
            console.error(`  ❌ Ошибка для СПА ${spa.name}:`, spaError.message)
            continue
          }

          console.log(`  ✅ ${spa.name}`)

          // Добавляем услуги
          if (spa.services && spa.services.length > 0) {
            const { error: servicesError } = await supabase
              .from('spa_services')
              .insert(
                spa.services.map(s => ({
                  spa_id: spaData.id,
                  name: s.name,
                  description: s.description,
                  price: s.price,
                  image: s.image
                }))
              )
            
            if (servicesError) {
              console.error(`    ❌ Ошибка добавления услуг:`, servicesError.message)
            } else {
              console.log(`    ✅ Услуги добавлены (${spa.services.length})`)
            }
          }

          // Добавляем удобства
          if (spa.amenities && spa.amenities.length > 0) {
            const amenityIds = spa.amenities
              .map(name => amenityMap.get(name))
              .filter(Boolean)

            if (amenityIds.length > 0) {
              const { error: amenitiesError } = await supabase
                .from('spa_amenities')
                .insert(
                  amenityIds.map(amenityId => ({
                    spa_id: spaData.id,
                    amenity_id: amenityId
                  }))
                )
              
              if (amenitiesError) {
                console.error(`    ❌ Ошибка добавления удобств:`, amenitiesError.message)
              } else {
                console.log(`    ✅ Удобства добавлены (${amenityIds.length})`)
              }
            }
          }

          // Добавляем контакты
          if (spa.contactInfo) {
            const { error: contactError } = await supabase
              .from('spa_contacts')
              .insert({
                spa_id: spaData.id,
                phone: spa.contactInfo.phone,
                email: spa.contactInfo.email,
                working_hours: spa.contactInfo.workingHours,
                whatsapp: spa.contactInfo.whatsapp,
                telegram: spa.contactInfo.telegram
              })
            
            if (contactError) {
              console.error(`    ❌ Ошибка добавления контактов:`, contactError.message)
            } else {
              console.log(`    ✅ Контакты добавлены`)
            }
          }

        } catch (error) {
          console.error(`  ❌ Критическая ошибка для ${spa.name}:`, error)
        }
      }

      console.log('\n✨ Миграция завершена успешно!')
      console.log('\n📊 Статистика:')
      console.log(`  • Городов: ${mockCities.length}`)
      console.log(`  • Категорий: ${mockCategories.length}`)
      console.log(`  • Назначений: ${mockPurposes.length}`)
      console.log(`  • Удобств: ${mockAmenities.length}`)
      console.log(`  • Шаблонов услуг: ${mockServiceTemplates.length}`)
      console.log(`  • СПА комплексов: ${mockSpas.length}`)

    } catch (error) {
      console.error('\n❌ Критическая ошибка миграции:', error)
      process.exit(1)
    }
  })
})
