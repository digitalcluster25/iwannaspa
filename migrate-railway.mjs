import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectionString = 'postgresql://postgres:piAlmgrclkSirLRLJfGwJizmKrIpKaXs@switchback.proxy.rlwy.net:44855/railway';

console.log('🔍 Подключение к Railway PostgreSQL...');

const client = new pg.Client({
  connectionString,
  ssl: false // Railway не требует SSL для внешних подключений
});

try {
  await client.connect();
  console.log('✅ Подключено к Railway PostgreSQL');

  // Читаем SQL файл
  const schemaSQL = readFileSync(join(__dirname, 'railway-schema.sql'), 'utf-8');
  
  console.log('📝 Выполнение миграции...');
  
  await client.query(schemaSQL);
  
  console.log('✅ Миграция успешно выполнена!');
  
  // Проверяем созданные таблицы
  const result = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  
  console.log('\n📊 Созданные таблицы:');
  result.rows.forEach(row => {
    console.log(`  ✓ ${row.table_name}`);
  });
  
} catch (error) {
  console.error('❌ Ошибка миграции:', error.message);
  process.exit(1);
} finally {
  await client.end();
  console.log('\n🔌 Отключено от БД');
}
