#!/usr/bin/env node

/**
 * Скрипт для настройки базы данных на Railway PostgreSQL
 * Этап 1: Создание схемы базы данных
 */

import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Конфигурация подключения к Railway PostgreSQL
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

async function setupRailwayDatabase() {
  const client = new Client(railwayConfig);
  
  try {
    console.log('🔗 Подключение к Railway PostgreSQL...');
    await client.connect();
    console.log('✅ Подключение установлено');

    // Читаем SQL схему
    const schemaPath = path.join(__dirname, 'railway-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Применение схемы базы данных...');
    
    // Выполняем весь SQL как один блок
    try {
      await client.query(schemaSQL);
      console.log('✅ Схема базы данных успешно применена');
    } catch (error) {
      console.error('❌ Ошибка применения схемы:', error.message);
      throw error;
    }

    // Проверяем созданные таблицы
    console.log('\n🔍 Проверка созданных таблиц...');
    const tablesResult = await client.query(`
      SELECT 
        schemaname,
        tablename,
        tableowner
      FROM pg_tables 
      WHERE schemaname = 'app'
      ORDER BY tablename
    `);

    console.log(`\n📋 Создано таблиц: ${tablesResult.rows.length}`);
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.tablename}`);
    });

    // Проверяем расширения
    console.log('\n🔧 Проверка расширений...');
    const extensionsResult = await client.query(`
      SELECT extname FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto')
    `);

    console.log(`📦 Установлено расширений: ${extensionsResult.rows.length}`);
    extensionsResult.rows.forEach(row => {
      console.log(`  - ${row.extname}`);
    });

    console.log('\n🎉 Схема базы данных успешно создана!');
    console.log('\n📝 Следующие шаги:');
    console.log('1. Экспорт данных из Supabase');
    console.log('2. Импорт данных в Railway PostgreSQL');
    console.log('3. Настройка PostgREST API');
    console.log('4. Обновление конфигурации приложения');

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
  setupRailwayDatabase().catch(console.error);
}

export { setupRailwayDatabase };
