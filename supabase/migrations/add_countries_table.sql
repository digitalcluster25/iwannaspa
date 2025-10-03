-- Создание таблицы стран
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE, -- ISO код страны (CH, ES, US)
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Добавление поля country_id в таблицу cities
ALTER TABLE cities ADD COLUMN IF NOT EXISTS country_id UUID REFERENCES countries(id) ON DELETE SET NULL;

-- Включаем RLS для таблицы countries
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- Политики доступа для countries
CREATE POLICY "Enable read access for all users" ON countries FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON countries FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON countries FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON countries FOR DELETE USING (true);

-- Индекс для производительности
CREATE INDEX IF NOT EXISTS idx_cities_country ON cities(country_id);

-- Добавление стран
INSERT INTO countries (name, code) VALUES 
  ('Швейцария', 'CH'),
  ('Испания', 'ES'),
  ('США', 'US')
ON CONFLICT (name) DO NOTHING;


