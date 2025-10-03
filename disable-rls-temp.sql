-- ВРЕМЕННОЕ решение - отключить RLS для profiles
-- ⚠️ НЕ используй на проде! Это только для локальной разработки

ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Или создать политику которая дает доступ всем авторизованным
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
CREATE POLICY "Enable read access for authenticated users"
ON profiles FOR SELECT
TO authenticated
USING (true);
