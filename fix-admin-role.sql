-- Исправляем роль для digitalcluster25@gmail.com
-- Меняем vendor на admin и активируем

UPDATE profiles 
SET 
  role = 'admin',
  active = true,
  name = 'Admin' -- можно оставить "Татумир" или изменить
WHERE id = '1405a0a4-f49c-4b52-aa25-f1c1a7ea3082';

-- Проверяем результат
SELECT 
  p.id, 
  p.name, 
  p.role, 
  p.active,
  u.email
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.email = 'digitalcluster25@gmail.com';
