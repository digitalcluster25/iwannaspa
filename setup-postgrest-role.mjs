import pg from 'pg';

const client = new pg.Client({
  connectionString: 'postgresql://postgres:piAlmgrclkSirLRLJfGwJizmKrIpKaXs@switchback.proxy.rlwy.net:44855/railway'
});

try {
  await client.connect();
  console.log('📝 Создание роли для PostgREST...');

  // Создаём роль web_anon
  await client.query(`
    DO $$ BEGIN
      CREATE ROLE web_anon NOLOGIN;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END $$;
  `);

  // Даём права на схему public
  await client.query('GRANT USAGE ON SCHEMA public TO web_anon');

  // Даём права на все таблицы
  await client.query('GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO web_anon');

  // Даём права на последовательности (для auto-increment)
  await client.query('GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO web_anon');

  // Делаем права по умолчанию для новых таблиц
  await client.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO web_anon');
  await client.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO web_anon');

  console.log('✅ Роль web_anon создана и настроена');

} catch (error) {
  console.error('❌ Ошибка:', error.message);
  process.exit(1);
} finally {
  await client.end();
}
