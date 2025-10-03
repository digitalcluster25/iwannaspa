-- ВРЕМЕННО отключаем RLS для profiles для диагностики
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- После этого запроса страница должна загрузиться быстро
-- Если да - значит проблема в RLS политиках
