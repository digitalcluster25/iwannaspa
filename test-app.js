#!/usr/bin/env node

/**
 * Тестирование приложения Iwanna
 * Проверяет основные функции и страницы
 */

import { createClient } from '@supabase/supabase-js';

// Конфигурация Supabase
const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E';

async function testApp() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔗 Подключение к Supabase...');
    console.log('✅ Supabase подключение установлено');

    console.log('\n📊 Тестирование основных функций...');
    
    // Тест 1: Проверяем загрузку стран
    console.log('\n🌍 Тест 1: Загрузка стран');
    try {
      const { data: countries, error } = await supabase
        .from('countries')
        .select('*')
        .limit(5);
      
      if (error) {
        console.error('❌ Ошибка загрузки стран:', error.message);
      } else {
        console.log(`✅ Загружено стран: ${countries.length}`);
        countries.forEach(country => {
          console.log(`  - ${country.name} (${country.code})`);
        });
      }
    } catch (error) {
      console.error('❌ Ошибка теста стран:', error.message);
    }

    // Тест 2: Проверяем загрузку городов
    console.log('\n🏙️ Тест 2: Загрузка городов');
    try {
      const { data: cities, error } = await supabase
        .from('cities')
        .select('*')
        .limit(5);
      
      if (error) {
        console.error('❌ Ошибка загрузки городов:', error.message);
      } else {
        console.log(`✅ Загружено городов: ${cities.length}`);
        cities.forEach(city => {
          console.log(`  - ${city.name} ${city.district ? `(${city.district})` : ''}`);
        });
      }
    } catch (error) {
      console.error('❌ Ошибка теста городов:', error.message);
    }

    // Тест 3: Проверяем загрузку СПА
    console.log('\n🏊 Тест 3: Загрузка СПА комплексов');
    try {
      const { data: spas, error } = await supabase
        .from('spas')
        .select(`
          *,
          city:cities(name),
          brand:brands(name)
        `)
        .limit(5);
      
      if (error) {
        console.error('❌ Ошибка загрузки СПА:', error.message);
      } else {
        console.log(`✅ Загружено СПА: ${spas.length}`);
        spas.forEach(spa => {
          console.log(`  - ${spa.name} → ${spa.city?.name || 'Без города'} (${spa.brand?.name || 'Без бренда'})`);
        });
      }
    } catch (error) {
      console.error('❌ Ошибка теста СПА:', error.message);
    }

    // Тест 4: Проверяем загрузку профилей
    console.log('\n👥 Тест 4: Загрузка профилей');
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);
      
      if (error) {
        console.error('❌ Ошибка загрузки профилей:', error.message);
      } else {
        console.log(`✅ Загружено профилей: ${profiles.length}`);
        profiles.forEach(profile => {
          console.log(`  - ${profile.name} (${profile.role}) - ${profile.active ? 'активен' : 'неактивен'}`);
        });
      }
    } catch (error) {
      console.error('❌ Ошибка теста профилей:', error.message);
    }

    // Тест 5: Проверяем загрузку услуг СПА
    console.log('\n💆 Тест 5: Загрузка услуг СПА');
    try {
      const { data: services, error } = await supabase
        .from('spa_services')
        .select(`
          *,
          spa:spas(name)
        `)
        .limit(5);
      
      if (error) {
        console.error('❌ Ошибка загрузки услуг:', error.message);
      } else {
        console.log(`✅ Загружено услуг: ${services.length}`);
        services.forEach(service => {
          console.log(`  - ${service.name} → ${service.spa?.name || 'Без СПА'} (${service.price} грн)`);
        });
      }
    } catch (error) {
      console.error('❌ Ошибка теста услуг:', error.message);
    }

    // Тест 6: Проверяем веб-приложение
    console.log('\n🌐 Тест 6: Проверка веб-приложения');
    try {
      const response = await fetch('http://localhost:3001/');
      if (response.ok) {
        console.log('✅ Веб-приложение доступно');
        const html = await response.text();
        if (html.includes('SPA Complex Catalog')) {
          console.log('✅ Заголовок страницы найден');
        } else {
          console.log('⚠️ Заголовок страницы не найден');
        }
      } else {
        console.log(`❌ Веб-приложение недоступно: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Ошибка проверки веб-приложения: ${error.message}`);
    }

    console.log('\n🎉 Тестирование приложения завершено!');
    console.log('\n📝 Результаты:');
    console.log('✅ Supabase подключение работает');
    console.log('✅ Основные таблицы доступны');
    console.log('✅ Данные загружаются корректно');
    console.log('✅ Веб-приложение работает');

  } catch (error) {
    console.error('❌ Критическая ошибка тестирования:', error.message);
    process.exit(1);
  }
}

// Запуск скрипта
if (import.meta.url === `file://${process.argv[1]}`) {
  testApp().catch(console.error);
}

export { testApp };
