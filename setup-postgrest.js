#!/usr/bin/env node

/**
 * Скрипт для настройки PostgREST ролей
 */

import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function setupPostgREST() {
  const client = new Client(railwayConfig);
  
  try {
    console.log('🔗 Подключение к Railway PostgreSQL...');
    await client.connect();
    console.log('✅ Подключение установлено');

    // Читаем SQL для настройки ролей
    const rolesPath = path.join(__dirname, 'setup-postgrest-roles.sql');
    const rolesSQL = fs.readFileSync(rolesPath, 'utf8');
    
    console.log('📋 Настройка ролей PostgREST...');
    
    try {
      await client.query(rolesSQL);
      console.log('✅ Роли PostgREST успешно настроены');
    } catch (error) {
      console.error('❌ Ошибка настройки ролей:', error.message);
      throw error;
    }

    // Проверяем созданные роли
    console.log('\n🔍 Проверка ролей...');
    const rolesResult = await client.query(`
      SELECT rolname, rolsuper, rolinherit, rolcreaterole, rolcreatedb, rolcanlogin 
      FROM pg_roles 
      WHERE rolname IN ('web_anon', 'web_auth', 'app_user', 'app_admin')
      ORDER BY rolname
    `);

    console.log(`\n👥 Настроено ролей: ${rolesResult.rows.length}`);
    rolesResult.rows.forEach(row => {
      console.log(`  - ${row.rolname} (super: ${row.rolsuper}, login: ${row.rolcanlogin})`);
    });

    console.log('\n🎉 PostgREST роли успешно настроены!');
    console.log('\n📝 Следующие шаги:');
    console.log('1. Перезапустить PostgREST сервис на Railway');
    console.log('2. Обновить конфигурацию приложения');
    console.log('3. Протестировать API endpoints');

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
  setupPostgREST().catch(console.error);
}

export { setupPostgREST };
