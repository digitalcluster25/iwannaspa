-- ВНИМАНИЕ: Это временное решение только для диагностики!
-- НЕ использовать в production!

-- Отключаем RLS на profiles для тестирования
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Если это не помогло, можно отключить на других таблицах:
-- ALTER TABLE brands DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE spas DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE spa_amenities DISABLE ROW LEVEL SECURITY;

-- Для включения обратно:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
