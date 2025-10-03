-- Найдем профиль digitalcluster25@gmail.com
SELECT 
  p.id, 
  p.name, 
  p.role, 
  p.active,
  u.email
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.email = 'digitalcluster25@gmail.com';
