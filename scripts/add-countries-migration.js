import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Загружаем переменные окружения
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  try {
    console.log('🚀 Starting migration...')

    // Создаем таблицу стран
    console.log('📋 Creating countries table...')
    const { error: countriesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS countries (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL UNIQUE,
          code TEXT NOT NULL UNIQUE,
          active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    })

    if (countriesError) {
      console.error('❌ Error creating countries table:', countriesError)
    } else {
      console.log('✅ Countries table created')
    }

    // Добавляем поле country_id в cities
    console.log('🔗 Adding country_id to cities...')
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE cities ADD COLUMN IF NOT EXISTS country_id UUID REFERENCES countries(id) ON DELETE SET NULL;
      `
    })

    if (alterError) {
      console.error('❌ Error adding country_id column:', alterError)
    } else {
      console.log('✅ country_id column added to cities')
    }

    // Добавляем страны
    console.log('🌍 Adding countries...')
    const countries = [
      { name: 'Швейцария', code: 'CH' },
      { name: 'Испания', code: 'ES' },
      { name: 'США', code: 'US' }
    ]

    for (const country of countries) {
      const { error: insertError } = await supabase
        .from('countries')
        .upsert(country, { onConflict: 'name' })

      if (insertError) {
        console.error(`❌ Error inserting ${country.name}:`, insertError)
      } else {
        console.log(`✅ Added country: ${country.name}`)
      }
    }

    // Включаем RLS
    console.log('🔒 Enabling RLS for countries...')
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON countries FOR SELECT USING (true);
        CREATE POLICY IF NOT EXISTS "Enable insert for all users" ON countries FOR INSERT WITH CHECK (true);
        CREATE POLICY IF NOT EXISTS "Enable update for all users" ON countries FOR UPDATE USING (true);
        CREATE POLICY IF NOT EXISTS "Enable delete for all users" ON countries FOR DELETE USING (true);
      `
    })

    if (rlsError) {
      console.error('❌ Error setting up RLS:', rlsError)
    } else {
      console.log('✅ RLS policies created')
    }

    // Создаем индекс
    console.log('📊 Creating index...')
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_cities_country ON cities(country_id);
      `
    })

    if (indexError) {
      console.error('❌ Error creating index:', indexError)
    } else {
      console.log('✅ Index created')
    }

    console.log('🎉 Migration completed successfully!')

  } catch (error) {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  }
}

runMigration()


