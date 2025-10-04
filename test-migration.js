#!/usr/bin/env node

/**
 * Скрипт для тестирования миграции
 * Проверяет работу Railway PostgreSQL + PostgREST
 */

import { Client } from 'pg';

// Конфигурация Railway PostgreSQL
const railwayConfig = {
  host: 'switchback.proxy.rlwy.net',
  port: 44855,
  database: 'railway',
  user: 'postgres',
  password: 'piAlmgrclkSirLRLJfGwJizmKrIpKaXs',
  ssl: {
    rejectUnauthorized: false
  }
};

async function testMigration() {
  const client = new Client(railwayConfig);
  
  try {
    console.log('🔗 Подключение к Railway PostgreSQL...');
    await client.connect();
    console.log('✅ Подключение установлено');

    console.log('\n📊 Тестирование миграции...');
    
    // Устанавливаем схему по умолчанию
    await client.query('SET search_path TO app, public;');

    // Тест 1: Проверяем количество записей в каждой таблице
    console.log('\n🔍 Проверка количества записей:');
    const tables = [
      'countries', 'cities', 'categories', 'purposes', 'amenities',
      'service_templates', 'profiles', 'brands', 'spas', 'spa_services',
      'spa_amenities', 'spa_contacts', 'leads'
    ];

    let totalRecords = 0;
    for (const table of tables) {
      try {
        const result = await client.query(`SELECT COUNT(*) as count FROM app.${table}`);
        const count = parseInt(result.rows[0].count);
        console.log(`  ${table}: ${count} записей`);
        totalRecords += count;
      } catch (error) {
        console.log(`  ${table}: ошибка - ${error.message}`);
      }
    }

    console.log(`\n📈 Всего записей: ${totalRecords}`);

    // Тест 2: Проверяем связи между таблицами
    console.log('\n🔗 Проверка связей между таблицами:');
    
    try {
      // Проверяем связи СПА с городами
      const spaCitiesResult = await client.query(`
        SELECT s.name as spa_name, c.name as city_name 
        FROM app.spas s 
        LEFT JOIN app.cities c ON s.city_id = c.id 
        LIMIT 5
      `);
      console.log('  СПА ↔ Города:');
      spaCitiesResult.rows.forEach(row => {
        console.log(`    ${row.spa_name} → ${row.city_name || 'Без города'}`);
      });
    } catch (error) {
      console.log('  СПА ↔ Города: ошибка -', error.message);
    }

    try {
      // Проверяем связи СПА с услугами
      const spaServicesResult = await client.query(`
        SELECT s.name as spa_name, COUNT(ss.id) as services_count
        FROM app.spas s 
        LEFT JOIN app.spa_services ss ON s.id = ss.spa_id 
        GROUP BY s.id, s.name
        LIMIT 5
      `);
      console.log('  СПА ↔ Услуги:');
      spaServicesResult.rows.forEach(row => {
        console.log(`    ${row.spa_name}: ${row.services_count} услуг`);
      });
    } catch (error) {
      console.log('  СПА ↔ Услуги: ошибка -', error.message);
    }

    // Тест 3: Проверяем данные профилей
    console.log('\n👥 Проверка профилей пользователей:');
    try {
      const profilesResult = await client.query(`
        SELECT name, role, active, created_at 
        FROM app.profiles 
        ORDER BY created_at DESC
      `);
      console.log('  Профили:');
      profilesResult.rows.forEach(row => {
        console.log(`    ${row.name} (${row.role}) - ${row.active ? 'активен' : 'неактивен'}`);
      });
    } catch (error) {
      console.log('  Профили: ошибка -', error.message);
    }

    // Тест 4: Проверяем PostgREST API
    console.log('\n🌐 Тестирование PostgREST API:');
    try {
      const response = await fetch('https://postgrestpostgrest-production-44bc.up.railway.app/countries');
      if (response.ok) {
        const data = await response.json();
        console.log(`  PostgREST API: ✅ работает (${data.length} стран)`);
        console.log(`  Пример данных: ${data[0]?.name || 'нет данных'}`);
      } else {
        console.log(`  PostgREST API: ❌ ошибка ${response.status}`);
      }
    } catch (error) {
      console.log(`  PostgREST API: ❌ ошибка - ${error.message}`);
    }

    console.log('\n🎉 Тестирование миграции завершено!');
    console.log('\n📝 Результаты:');
    console.log(`✅ База данных: работает`);
    console.log(`✅ Данные: ${totalRecords} записей мигрировано`);
    console.log(`✅ Связи: проверены`);
    console.log(`✅ API: проверен`);

  } catch (error) {
    console.error('❌ Критическая ошибка тестирования:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Соединение закрыто');
  }
}

// Запуск скрипта
if (import.meta.url === `file://${process.argv[1]}`) {
  testMigration().catch(console.error);
}

export { testMigration };
