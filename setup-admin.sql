-- ============================================
-- Настройка администратора для Iwanna
-- ============================================

-- Шаг 1: Удаляем старого пользователя (если есть)
DELETE FROM auth.users WHERE email = 'admin@iwanna.com';

-- Шаг 2: Создаем администратора с подтвержденным email и правильной ролью
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@iwanna.com',
  crypt('admin123', gen_salt('bf')),  -- Пароль: admin123
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Admin","role":"admin"}'::jsonb,  -- Роль admin сразу!
  NOW(),
  NOW(),
  '',
  ''
);

-- Шаг 3: Проверяем результат
SELECT 
  id,
  email,
  email_confirmed_at,
  raw_user_meta_data->>'name' as name,
  raw_user_meta_data->>'role' as role,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Email подтвержден'
    ELSE '❌ Email НЕ подтвержден'
  END as email_status,
  CASE 
    WHEN raw_user_meta_data->>'role' = 'admin' THEN '✅ Роль Admin'
    ELSE '❌ Нет роли Admin'
  END as role_status
FROM auth.users
WHERE email = 'admin@iwanna.com';

-- ============================================
-- Результат:
-- ✅ Email: admin@iwanna.com
-- ✅ Пароль: admin123
-- ✅ Роль: admin
-- ✅ Email подтвержден
-- ============================================
