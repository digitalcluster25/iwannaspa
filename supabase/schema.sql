-- Включаем расширение для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Таблица городов
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица категорий
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  value TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица назначений (purposes)
CREATE TABLE IF NOT EXISTS purposes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  value TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица удобств (amenities)
CREATE TABLE IF NOT EXISTS amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица шаблонов услуг
CREATE TABLE IF NOT EXISTS service_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Основная таблица СПА
CREATE TABLE IF NOT EXISTS spas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  location TEXT,
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}',
  category TEXT,
  purpose TEXT,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Услуги СПА
CREATE TABLE IF NOT EXISTS spa_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spa_id UUID REFERENCES spas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER,
  price DECIMAL(10,2) NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Связь СПА с удобствами (many-to-many)
CREATE TABLE IF NOT EXISTS spa_amenities (
  spa_id UUID REFERENCES spas(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (spa_id, amenity_id)
);

-- Контакты СПА
CREATE TABLE IF NOT EXISTS spa_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spa_id UUID REFERENCES spas(id) ON DELETE CASCADE UNIQUE,
  phone TEXT,
  email TEXT,
  working_hours TEXT,
  whatsapp TEXT,
  telegram TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Лиды
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spa_id UUID REFERENCES spas(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  selected_services JSONB NOT NULL DEFAULT '[]',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  message TEXT,
  status TEXT DEFAULT 'new',
  visit_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_spas_category ON spas(category);
CREATE INDEX IF NOT EXISTS idx_spas_city ON spas(city_id);
CREATE INDEX IF NOT EXISTS idx_spas_active ON spas(active);
CREATE INDEX IF NOT EXISTS idx_spas_featured ON spas(featured);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_spa ON leads(spa_id);
CREATE INDEX IF NOT EXISTS idx_spa_services_spa ON spa_services(spa_id);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_spas_updated_at BEFORE UPDATE ON spas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Включаем Row Level Security (RLS) для безопасности
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE purposes ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE spas ENABLE ROW LEVEL SECURITY;
ALTER TABLE spa_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE spa_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE spa_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Политики доступа (пока открытый доступ для чтения, позже настроим авторизацию)
CREATE POLICY "Enable read access for all users" ON cities FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON purposes FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON amenities FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON service_templates FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON spas FOR SELECT USING (active = true);
CREATE POLICY "Enable read access for all users" ON spa_services FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON spa_amenities FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON spa_contacts FOR SELECT USING (true);

-- Политики для записи (временно разрешаем всем, потом ограничим для админов)
CREATE POLICY "Enable insert for all users" ON cities FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON cities FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON cities FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON categories FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON categories FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON purposes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON purposes FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON purposes FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON amenities FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON amenities FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON amenities FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON service_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON service_templates FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON service_templates FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON spas FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON spas FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON spas FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON spa_services FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON spa_services FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON spa_services FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON spa_amenities FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON spa_amenities FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON spa_contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON spa_contacts FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON spa_contacts FOR DELETE USING (true);

CREATE POLICY "Enable insert for all users" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for all users" ON leads FOR SELECT USING (true);
CREATE POLICY "Enable update for all users" ON leads FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON leads FOR DELETE USING (true);
