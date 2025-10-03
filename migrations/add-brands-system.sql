-- Миграция: Добавление системы брендов для вендоров

-- 1. Создаем таблицу brands
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  active BOOLEAN DEFAULT true,
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Добавляем brand_id в таблицу spas
ALTER TABLE spas ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id) ON DELETE SET NULL;

-- 3. Добавляем поле active в profiles (для вендоров)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT false;

-- 4. Создаем таблицу spa_amenities для кастомных описаний удобств
CREATE TABLE IF NOT EXISTS spa_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spa_id UUID NOT NULL REFERENCES spas(id) ON DELETE CASCADE,
  amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  custom_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(spa_id, amenity_id)
);

-- 5. Удаляем spa_id из profiles (если существует)
ALTER TABLE profiles DROP COLUMN IF EXISTS spa_id;

-- 6. Обновляем существующих пользователей
-- Все существующие админы и пользователи активны
UPDATE profiles SET active = true WHERE role IN ('admin', 'user');

-- Только digitalcluster25@gmail.com является админом
UPDATE profiles SET role = 'user' WHERE role = 'admin' AND id NOT IN (
  SELECT id FROM auth.users WHERE email = 'digitalcluster25@gmail.com'
);

-- 7. Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_brands_owner_id ON brands(owner_id);
CREATE INDEX IF NOT EXISTS idx_spas_brand_id ON spas(brand_id);
CREATE INDEX IF NOT EXISTS idx_spa_amenities_spa_id ON spa_amenities(spa_id);
CREATE INDEX IF NOT EXISTS idx_spa_amenities_amenity_id ON spa_amenities(amenity_id);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles(active);

-- 8. RLS политики для brands
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Админ видит все бренды
DROP POLICY IF EXISTS "Admins can view all brands" ON brands;
CREATE POLICY "Admins can view all brands"
ON brands FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Вендоры видят свои бренды
DROP POLICY IF EXISTS "Vendors can view their brands" ON brands;
CREATE POLICY "Vendors can view their brands"
ON brands FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid() 
  OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Админ может создавать/редактировать бренды
DROP POLICY IF EXISTS "Admins can manage brands" ON brands;
CREATE POLICY "Admins can manage brands"
ON brands FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 9. RLS политики для spa_amenities
ALTER TABLE spa_amenities ENABLE ROW LEVEL SECURITY;

-- Все могут читать
DROP POLICY IF EXISTS "Anyone can view spa amenities" ON spa_amenities;
CREATE POLICY "Anyone can view spa amenities"
ON spa_amenities FOR SELECT
TO authenticated
USING (true);

-- Вендоры могут управлять удобствами своих СПА
DROP POLICY IF EXISTS "Vendors can manage their spa amenities" ON spa_amenities;
CREATE POLICY "Vendors can manage their spa amenities"
ON spa_amenities FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM spas
    JOIN brands ON spas.brand_id = brands.id
    WHERE spas.id = spa_amenities.spa_id
    AND brands.owner_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 10. Обновляем RLS для spas - вендоры видят свои СПА
DROP POLICY IF EXISTS "Vendors can view their spas" ON spas;
CREATE POLICY "Vendors can view their spas"
ON spas FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM brands
    WHERE brands.id = spas.brand_id
    AND brands.owner_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
  OR
  active = true -- публичные СПА
);

-- Вендоры могут управлять своими СПА
DROP POLICY IF EXISTS "Vendors can manage their spas" ON spas;
CREATE POLICY "Vendors can manage their spas"
ON spas FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM brands
    WHERE brands.id = spas.brand_id
    AND brands.owner_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 11. Комментарии к таблицам
COMMENT ON TABLE brands IS 'Бренды принадлежащие вендорам';
COMMENT ON TABLE spa_amenities IS 'Кастомные описания удобств для каждого СПА комплекса';
COMMENT ON COLUMN profiles.active IS 'Активирован ли вендор админом (для role=vendor)';
COMMENT ON COLUMN spas.brand_id IS 'Привязка СПА к бренду';
