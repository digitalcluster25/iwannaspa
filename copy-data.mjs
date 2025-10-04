import pg from 'pg';

// Supabase REST API
const SUPABASE_URL = 'https://ewkeuupfristqqonkcph.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E';

// Railway PostgreSQL
const railwayConnection = 'postgresql://postgres:piAlmgrclkSirLRLJfGwJizmKrIpKaXs@switchback.proxy.rlwy.net:44855/railway';
const railway = new pg.Client({ connectionString: railwayConnection });

console.log('🔍 Подключение к Railway PostgreSQL...');

async function fetchFromSupabase(table) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }
  
  return await response.json();
}

try {
  await railway.connect();
  console.log('✅ Подключено к Railway');

  // Порядок переноса таблиц (важен из-за foreign keys)
  const tables = [
    'countries',
    'categories', 
    'purposes',
    'amenities',
    'service_templates',
    'cities',
    'profiles',
    'brands',
    'spas',
    'spa_services',
    'spa_amenities',
    'spa_contacts',
    'leads',
  ];

  let totalCopied = 0;

  for (const table of tables) {
    try {
      console.log(`📥 Загрузка ${table} из Supabase...`);
      const rows = await fetchFromSupabase(table);
      
      if (rows.length === 0) {
        console.log(`⏭️  ${table}: пусто, пропускаем`);
        continue;
      }

      // Получаем названия колонок
      const columns = Object.keys(rows[0]);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      const columnNames = columns.join(', ');

      // Вставляем в Railway
      for (const row of rows) {
        const values = columns.map(col => row[col]);
        
        await railway.query(
          `INSERT INTO ${table} (${columnNames}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
          values
        );
      }

      totalCopied += rows.length;
      console.log(`✅ ${table}: скопировано ${rows.length} записей`);
      
    } catch (error) {
      console.error(`❌ Ошибка при копировании ${table}:`, error.message);
      // Продолжаем с остальными таблицами
    }
  }

  console.log(`\n🎉 Миграция завершена! Всего скопировано: ${totalCopied} записей`);

  // Проверяем результат
  console.log('\n📊 Проверка данных в Railway:');
  for (const table of tables) {
    const { rows } = await railway.query(`SELECT COUNT(*) FROM ${table}`);
    console.log(`  ${table}: ${rows[0].count} записей`);
  }

} catch (error) {
  console.error('❌ Критическая ошибка:', error.message);
  console.error(error.stack);
  process.exit(1);
} finally {
  await railway.end();
  console.log('\n🔌 Отключено от БД');
}
