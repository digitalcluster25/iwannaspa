-- Railway PostgreSQL Schema for Iwanna SPA Platform
-- Этап 1: Создание схемы базы данных

-- Включаем необходимые расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Создаем схему для приложения
CREATE SCHEMA IF NOT EXISTS app;

-- Устанавливаем схему по умолчанию
SET search_path TO app, public;

-- =============================================
-- 1. СТРАНЫ (countries)
-- =============================================
CREATE TABLE app.countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. ГОРОДА (cities)
-- =============================================
CREATE TABLE app.cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    district TEXT,
  active BOOLEAN DEFAULT true,
    country_id UUID REFERENCES app.countries(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. КАТЕГОРИИ (categories)
-- =============================================
CREATE TABLE app.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
    label TEXT,
  value TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. ЦЕЛИ (purposes)
-- =============================================
CREATE TABLE app.purposes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
    label TEXT,
  value TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. УДОБСТВА (amenities)
-- =============================================
CREATE TABLE app.amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 6. ШАБЛОНЫ УСЛУГ (service_templates)
-- =============================================
CREATE TABLE app.service_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 7. ПРОФИЛИ ПОЛЬЗОВАТЕЛЕЙ (profiles)
-- =============================================
CREATE TABLE app.profiles (
    id UUID PRIMARY KEY,
    name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'vendor', 'user')),
    active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 8. БРЕНДЫ (brands)
-- =============================================
CREATE TABLE app.brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  active BOOLEAN DEFAULT true,
    owner_id UUID REFERENCES app.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 9. СПА КОМПЛЕКСЫ (spas)
-- =============================================
CREATE TABLE app.spas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
    price NUMERIC,
    rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  location TEXT,
    city_id UUID REFERENCES app.cities(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}',
  category TEXT,
  purpose TEXT,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    categories TEXT[],
    purposes TEXT[],
    address TEXT,
    address_comment TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    brand_id UUID REFERENCES app.brands(id) ON DELETE SET NULL
);

-- =============================================
-- 10. УСЛУГИ СПА (spa_services)
-- =============================================
CREATE TABLE app.spa_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spa_id UUID REFERENCES app.spas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER,
    price NUMERIC NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 11. УДОБСТВА СПА (spa_amenities)
-- =============================================
CREATE TABLE app.spa_amenities (
    spa_id UUID REFERENCES app.spas(id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES app.amenities(id) ON DELETE CASCADE,
  custom_description TEXT,
    PRIMARY KEY (spa_id, amenity_id)
);

-- =============================================
-- 12. КОНТАКТЫ СПА (spa_contacts)
-- =============================================
CREATE TABLE app.spa_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spa_id UUID REFERENCES app.spas(id) ON DELETE CASCADE UNIQUE,
  phone TEXT,
  email TEXT,
  working_hours TEXT,
  whatsapp TEXT,
  telegram TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 13. ЗАЯВКИ (leads)
-- =============================================
CREATE TABLE app.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spa_id UUID REFERENCES app.spas(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
    selected_services JSONB DEFAULT '[]',
    total_amount NUMERIC DEFAULT 0,
  message TEXT,
  status TEXT DEFAULT 'new',
  visit_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ИНДЕКСЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ
-- =============================================

-- Индексы для поиска
CREATE INDEX idx_spas_active ON app.spas(active);
CREATE INDEX idx_spas_city_id ON app.spas(city_id);
CREATE INDEX idx_spas_brand_id ON app.spas(brand_id);
CREATE INDEX idx_spas_featured ON app.spas(featured);

-- Индексы для заявок
CREATE INDEX idx_leads_spa_id ON app.leads(spa_id);
CREATE INDEX idx_leads_status ON app.leads(status);
CREATE INDEX idx_leads_created_at ON app.leads(created_at);

-- Индексы для городов
CREATE INDEX idx_cities_country_id ON app.cities(country_id);
CREATE INDEX idx_cities_active ON app.cities(active);

-- Индексы для брендов
CREATE INDEX idx_brands_owner_id ON app.brands(owner_id);
CREATE INDEX idx_brands_active ON app.brands(active);

-- =============================================
-- ФУНКЦИИ ДЛЯ ОБНОВЛЕНИЯ TIMESTAMPS
-- =============================================

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION app.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON app.profiles
    FOR EACH ROW EXECUTE FUNCTION app.update_updated_at_column();

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON app.brands
    FOR EACH ROW EXECUTE FUNCTION app.update_updated_at_column();

CREATE TRIGGER update_spas_updated_at BEFORE UPDATE ON app.spas
    FOR EACH ROW EXECUTE FUNCTION app.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON app.leads
    FOR EACH ROW EXECUTE FUNCTION app.update_updated_at_column();

-- =============================================
-- КОММЕНТАРИИ К ТАБЛИЦАМ
-- =============================================

COMMENT ON TABLE app.countries IS 'Справочник стран';
COMMENT ON TABLE app.cities IS 'Справочник городов';
COMMENT ON TABLE app.categories IS 'Справочник категорий СПА';
COMMENT ON TABLE app.purposes IS 'Справочник целей посещения';
COMMENT ON TABLE app.amenities IS 'Справочник удобств';
COMMENT ON TABLE app.service_templates IS 'Шаблоны услуг СПА';
COMMENT ON TABLE app.profiles IS 'Профили пользователей с ролями';
COMMENT ON TABLE app.brands IS 'Бренды принадлежащие вендорам';
COMMENT ON TABLE app.spas IS 'СПА комплексы';
COMMENT ON TABLE app.spa_services IS 'Услуги конкретного СПА';
COMMENT ON TABLE app.spa_amenities IS 'Кастомные описания удобств для каждого СПА комплекса';
COMMENT ON TABLE app.spa_contacts IS 'Контактная информация СПА';
COMMENT ON TABLE app.leads IS 'Заявки от клиентов';

-- =============================================
-- ПРАВА ДОСТУПА
-- =============================================

-- Создаем роль для приложения (если не существует)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_user') THEN
        CREATE ROLE app_user;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_admin') THEN
        CREATE ROLE app_admin;
    END IF;
END
$$;

-- Даем права на схему app
GRANT USAGE ON SCHEMA app TO app_user, app_admin;

-- Даем права на все таблицы
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO app_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA app TO app_admin;

-- Даем права на последовательности
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app TO app_user, app_admin;

-- Даем права на функции
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA app TO app_user, app_admin;

-- =============================================
-- ГОТОВО!
-- =============================================

-- Выводим информацию о созданных таблицах
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'app'
ORDER BY tablename;