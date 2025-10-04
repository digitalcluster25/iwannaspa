#!/usr/bin/env node

/**
 * Скрипт для миграции данных из Supabase в Railway PostgreSQL
 * Этап 2: Экспорт и импорт данных
 */

import { createClient } from '@supabase/supabase-js';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Конфигурация Supabase
const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E';

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

// Порядок таблиц для импорта (учитывая зависимости)
const TABLE_ORDER = [
  'countries',
  'cities', 
  'categories',
  'purposes',
  'amenities',
  'service_templates',
  'profiles',
  'brands',
  'spas',
  'spa_services',
  'spa_amenities',
  'spa_contacts',
  'leads'
];

// Маппинг полей для преобразования данных
const FIELD_MAPPINGS = {
  'spas': {
    'reviewCount': 'review_count'
  }
};

async function migrateData() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const pgClient = new Client(railwayConfig);
  
  try {
    console.log('🔗 Подключение к базам данных...');
    await pgClient.connect();
    console.log('✅ Подключение к Railway PostgreSQL установлено');
    console.log('✅ Подключение к Supabase установлено');

    console.log('\n📊 Начинаем миграцию данных...');
    
    let totalMigrated = 0;
    let totalErrors = 0;

    // Устанавливаем схему по умолчанию
    await pgClient.query('SET search_path TO app, public;');

    for (const tableName of TABLE_ORDER) {
      try {
        console.log(`\n🔄 Миграция таблицы: ${tableName}`);
        
        // Получаем данные из Supabase
        const { data: supabaseData, error: supabaseError } = await supabase
          .from(tableName)
          .select('*');

        if (supabaseError) {
          console.error(`❌ Ошибка получения данных из Supabase (${tableName}):`, supabaseError.message);
          totalErrors++;
          continue;
        }

        if (!supabaseData || supabaseData.length === 0) {
          console.log(`⚠️  Таблица ${tableName} пуста, пропускаем`);
          continue;
        }

        console.log(`📥 Получено ${supabaseData.length} записей из Supabase`);

        // Преобразуем данные
        const transformedData = supabaseData.map(row => {
          const transformed = { ...row };
          
          // Применяем маппинг полей
          if (FIELD_MAPPINGS[tableName]) {
            Object.entries(FIELD_MAPPINGS[tableName]).forEach(([oldField, newField]) => {
              if (transformed[oldField] !== undefined) {
                transformed[newField] = transformed[oldField];
                delete transformed[oldField];
              }
            });
          }

          return transformed;
        });

        // Очищаем таблицу в Railway (если нужно)
        await pgClient.query(`DELETE FROM app.${tableName}`);

        // Вставляем данные в Railway PostgreSQL
        if (transformedData.length > 0) {
          const columns = Object.keys(transformedData[0]);
          const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
          const insertQuery = `
            INSERT INTO app.${tableName} (${columns.join(', ')})
            VALUES (${placeholders})
          `;

          for (const row of transformedData) {
            const values = columns.map(col => {
              const value = row[col];
              // Обрабатываем специальные типы данных
              if (Array.isArray(value)) {
                return value; // PostgreSQL принимает массивы напрямую
              }
              return value;
            });

            await pgClient.query(insertQuery, values);
          }

          console.log(`✅ Импортировано ${transformedData.length} записей в Railway PostgreSQL`);
          totalMigrated += transformedData.length;
        }

      } catch (error) {
        console.error(`❌ Ошибка миграции таблицы ${tableName}:`, error.message);
        totalErrors++;
      }
    }

    console.log('\n📊 Результаты миграции:');
    console.log(`✅ Всего записей мигрировано: ${totalMigrated}`);
    console.log(`❌ Ошибок: ${totalErrors}`);

    // Проверяем количество записей в каждой таблице
    console.log('\n🔍 Проверка количества записей:');
    for (const tableName of TABLE_ORDER) {
      try {
        const result = await pgClient.query(`SELECT COUNT(*) as count FROM app.${tableName}`);
        const count = result.rows[0].count;
        console.log(`  ${tableName}: ${count} записей`);
      } catch (error) {
        console.log(`  ${tableName}: ошибка проверки - ${error.message}`);
      }
    }

    console.log('\n🎉 Миграция данных завершена!');
    console.log('\n📝 Следующие шаги:');
    console.log('1. Настройка PostgREST API');
    console.log('2. Обновление конфигурации приложения');
    console.log('3. Тестирование функциональности');

  } catch (error) {
    console.error('❌ Критическая ошибка миграции:', error.message);
    process.exit(1);
  } finally {
    await pgClient.end();
    console.log('\n🔌 Соединения закрыты');
  }
}

// Запуск скрипта
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData().catch(console.error);
}

export { migrateData };
