#!/usr/bin/env node

/**
 * Тестирование подключения PostgREST к базе данных
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

async function testPostgRESTConnection() {
  const client = new Client(railwayConfig);
  
  try {
    console.log('🔗 Подключение к Railway PostgreSQL...');
    await client.connect();
    console.log('✅ Подключение установлено');

    // Проверяем подключение от имени web_anon
    console.log('\n🔍 Тестирование подключения web_anon...');
    
    try {
      // Устанавливаем роль web_anon
      await client.query('SET ROLE web_anon;');
      console.log('✅ Роль web_anon установлена');
      
      // Проверяем доступ к схеме app
      const schemaResult = await client.query(`
        SELECT schema_name 
        FROM information_schema.schemata 
        WHERE schema_name = 'app'
      `);
      console.log('✅ Схема app доступна:', schemaResult.rows.length > 0);
      
      // Проверяем доступ к таблицам
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'app'
        ORDER BY table_name
      `);
      console.log(`✅ Доступно таблиц: ${tablesResult.rows.length}`);
      tablesResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
      
      // Тестируем SELECT запрос
      const countriesResult = await client.query('SELECT COUNT(*) FROM app.countries');
      console.log(`✅ SELECT из countries: ${countriesResult.rows[0].count} записей`);
      
      // Тестируем SELECT с JOIN
      const spasResult = await client.query(`
        SELECT s.name, c.name as city_name 
        FROM app.spas s 
        LEFT JOIN app.cities c ON s.city_id = c.id 
        LIMIT 3
      `);
      console.log(`✅ SELECT с JOIN: ${spasResult.rows.length} записей`);
      spasResult.rows.forEach(row => {
        console.log(`  - ${row.name} → ${row.city_name || 'Без города'}`);
      });
      
    } catch (error) {
      console.error('❌ Ошибка при работе от имени web_anon:', error.message);
    }

    // Проверяем права доступа
    console.log('\n🔐 Проверка прав доступа...');
    
    try {
      // Возвращаемся к postgres
      await client.query('RESET ROLE;');
      
      // Проверяем права web_anon
      const grantsResult = await client.query(`
        SELECT 
          grantee, 
          table_name, 
          privilege_type 
        FROM information_schema.table_privileges 
        WHERE grantee = 'web_anon' 
        AND table_schema = 'app'
        ORDER BY table_name, privilege_type
      `);
      
      console.log(`✅ Права web_anon: ${grantsResult.rows.length} записей`);
      grantsResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}: ${row.privilege_type}`);
      });
      
    } catch (error) {
      console.error('❌ Ошибка проверки прав:', error.message);
    }

    console.log('\n🎉 Тестирование PostgREST подключения завершено!');

  } catch (error) {
    console.error('❌ Критическая ошибка:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Соединение закрыто');
  }
}

// Запуск скрипта
if (import.meta.url === `file://${process.argv[1]}`) {
  testPostgRESTConnection().catch(console.error);
}

export { testPostgRESTConnection };
