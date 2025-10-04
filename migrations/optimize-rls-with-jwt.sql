-- Миграция: Оптимизация RLS через JWT claims
-- Цель: Убрать медленные EXISTS запросы к profiles

-- Шаг 1: Создаем функцию для получения роли из JWT
CREATE OR REPLACE FUNCTION auth.user_role() 
RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'user_role',
    'user'
  )::TEXT;
$$ LANGUAGE sql STABLE;

-- Шаг 2: Создаем функцию для проверки активности вендора
CREATE OR REPLACE FUNCTION auth.vendor_is_active() 
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::json->>'vendor_active')::BOOLEAN,
    false
  );
$$ LANGUAGE sql STABLE;

-- Шаг 3: Триггер для обновления JWT при изменении профиля
CREATE OR REPLACE FUNCTION public.handle_profile_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Обновляем метаданные пользователя в auth.users
  UPDATE auth.users
  SET raw_app_meta_data = 
    raw_app_meta_data || 
    jsonb_build_object(
      'user_role', NEW.role,
      'vendor_active', NEW.active
    )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Создаем триггер
DROP TRIGGER IF EXISTS on_profile_update ON profiles;
CREATE TRIGGER on_profile_update
  AFTER INSERT OR UPDATE OF role, active ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_profile_changes();

-- Шаг 4: Обновляем существующие метаданные для всех пользователей
DO $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN SELECT id, role, active FROM profiles LOOP
    UPDATE auth.users
    SET raw_app_meta_data = 
      COALESCE(raw_app_meta_data, '{}'::jsonb) || 
      jsonb_build_object(
        'user_role', profile_record.role,
        'vendor_active', profile_record.active
      )
    WHERE id = profile_record.id;
  END LOOP;
END $$;

-- Шаг 5: УПРОЩАЕМ RLS политики для brands
DROP POLICY IF EXISTS "Admins can view all brands" ON brands;
DROP POLICY IF EXISTS "Vendors can view their brands" ON brands;
DROP POLICY IF EXISTS "Admins can manage brands" ON brands;

-- Админы видят все, вендоры видят свои
CREATE POLICY "View brands by role"
ON brands FOR SELECT
TO authenticated
USING (
  auth.user_role() = 'admin' 
  OR owner_id = auth.uid()
);

-- Только админы могут управлять
CREATE POLICY "Manage brands"
ON brands FOR ALL
TO authenticated
USING (auth.user_role() = 'admin');

-- Шаг 6: УПРОЩАЕМ RLS политики для spas
DROP POLICY IF EXISTS "Vendors can view their spas" ON spas;
DROP POLICY IF EXISTS "Vendors can manage their spas" ON spas;
DROP POLICY IF EXISTS "Enable read access for all users" ON spas;

-- Публичный доступ к активным СПА
CREATE POLICY "Public can view active spas"
ON spas FOR SELECT
TO anon, authenticated
USING (active = true);

-- Вендоры видят свои СПА (через brand)
CREATE POLICY "Vendors view their spas"
ON spas FOR SELECT
TO authenticated
USING (
  auth.user_role() = 'admin'
  OR EXISTS (
    SELECT 1 FROM brands
    WHERE brands.id = spas.brand_id
    AND brands.owner_id = auth.uid()
  )
);

-- Только админы и владельцы могут управлять
CREATE POLICY "Manage spas by role"
ON spas FOR ALL
TO authenticated
USING (
  auth.user_role() = 'admin'
  OR EXISTS (
    SELECT 1 FROM brands
    WHERE brands.id = spas.brand_id
    AND brands.owner_id = auth.uid()
  )
);

-- Шаг 7: УПРОЩАЕМ RLS для spa_amenities
DROP POLICY IF EXISTS "Anyone can view spa amenities" ON spa_amenities;
DROP POLICY IF EXISTS "Vendors can manage their spa amenities" ON spa_amenities;

-- Все могут читать
CREATE POLICY "Public can view spa amenities"
ON spa_amenities FOR SELECT
TO anon, authenticated
USING (true);

-- Управление только для админов и владельцев
CREATE POLICY "Manage spa amenities"
ON spa_amenities FOR ALL
TO authenticated
USING (
  auth.user_role() = 'admin'
  OR EXISTS (
    SELECT 1 FROM spas
    JOIN brands ON spas.brand_id = brands.id
    WHERE spas.id = spa_amenities.spa_id
    AND brands.owner_id = auth.uid()
  )
);

-- Шаг 8: Создаем политики для profiles (если их нет)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Удаляем старые политики если есть
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Все могут читать все профили (для списка пользователей в админке)
CREATE POLICY "View all profiles"
ON profiles FOR SELECT
TO authenticated
USING (true);

-- Пользователь может обновить только свой профиль
CREATE POLICY "Update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid() OR auth.user_role() = 'admin');

-- При регистрации можно создать свой профиль
CREATE POLICY "Insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid() OR auth.user_role() = 'admin');

-- Только админы могут удалять
CREATE POLICY "Delete profiles"
ON profiles FOR DELETE
TO authenticated
USING (auth.user_role() = 'admin');

-- Шаг 9: Добавляем комментарии
COMMENT ON FUNCTION auth.user_role() IS 'Получает роль пользователя из JWT claims вместо запроса к profiles';
COMMENT ON FUNCTION auth.vendor_is_active() IS 'Проверяет активность вендора из JWT claims';
COMMENT ON FUNCTION public.handle_profile_changes() IS 'Синхронизирует изменения профиля с JWT claims';
