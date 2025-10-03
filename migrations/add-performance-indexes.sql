-- Добавляем индексы для ускорения запросов

-- Индексы для profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles(active);
CREATE INDEX IF NOT EXISTS idx_profiles_role_active ON profiles(role, active);

-- Индексы для spas
CREATE INDEX IF NOT EXISTS idx_spas_active ON spas(active);
CREATE INDEX IF NOT EXISTS idx_spas_brand_id ON spas(brand_id);
CREATE INDEX IF NOT EXISTS idx_spas_country_id ON spas(country_id);
CREATE INDEX IF NOT EXISTS idx_spas_city_id ON spas(city_id);

-- Индексы для brands
CREATE INDEX IF NOT EXISTS idx_brands_owner_id ON brands(owner_id);
CREATE INDEX IF NOT EXISTS idx_brands_active ON brands(active);

-- Индексы для leads
CREATE INDEX IF NOT EXISTS idx_leads_spa_id ON leads(spa_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Индексы для spa_amenities
CREATE INDEX IF NOT EXISTS idx_spa_amenities_spa_id ON spa_amenities(spa_id);
CREATE INDEX IF NOT EXISTS idx_spa_amenities_amenity_id ON spa_amenities(amenity_id);

-- Индексы для countries и cities
CREATE INDEX IF NOT EXISTS idx_cities_country_id ON cities(country_id);
