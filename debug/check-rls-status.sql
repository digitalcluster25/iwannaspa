-- Проверка статуса RLS для profiles
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'profiles';

-- Если rls_enabled = true, значит RLS всё еще включен
-- Если rls_enabled = false, значит RLS отключен
