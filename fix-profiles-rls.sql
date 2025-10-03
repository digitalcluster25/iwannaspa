-- Исправление RLS политик для таблицы profiles

-- 1. Удаляем старые политики если есть
DROP POLICY IF EXISTS "Profiles are viewable by admins" ON profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow admins to read all profiles" ON profiles;

-- 2. Создаем новую политику - админы видят всё
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
USING (
  auth.jwt() ->> 'role' = 'admin' 
  OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 3. Политика для обновления профилей админами
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles"
ON profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 4. Проверяем что RLS включен
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Проверяем текущие политики
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';
