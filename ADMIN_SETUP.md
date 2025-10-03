# Создание администратора в Supabase

## 🔧 Объединенная система авторизации

Теперь у нас **единая система авторизации** через Supabase Auth для:
- ✅ Обычных пользователей (личный кабинет)
- ✅ Администраторов (админка)

Доступ к админке определяется **ролью** в метаданных пользователя.

---

## 🚀 Шаг 1: Создайте администратора

### Вариант А: Через интерфейс регистрации

1. Перейдите на http://localhost:3001/user-auth
2. Зарегистрируйте нового пользователя:
   - **Email**: admin@iwanna.com
   - **Пароль**: admin123 (или любой другой)
   - **Имя**: Admin
3. После регистрации переходите к Шагу 2

### Вариант Б: Через Supabase Dashboard

1. Откройте Supabase Dashboard: https://supabase.com/dashboard
2. Выберите ваш проект
3. Перейдите в **Authentication** → **Users**
4. Нажмите **Add user** → **Create new user**
5. Заполните:
   - **Email**: admin@iwanna.com
   - **Password**: admin123
   - **Auto Confirm User**: ✅ (галочка)
6. Нажмите **Create user**

---

## 🔐 Шаг 2: Назначьте роль администратора

После создания пользователя нужно добавить роль `admin` в его метаданные.

### Через SQL Editor в Supabase:

1. Перейдите в **SQL Editor** в Supabase Dashboard
2. Создайте новый запрос и выполните:

```sql
-- Найдите ID пользователя по email
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'admin@iwanna.com';

-- Добавьте роль admin в метаданные (замените YOUR_USER_ID на реальный ID из предыдущего запроса)
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@iwanna.com';

-- Проверьте, что роль добавлена
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'admin@iwanna.com';
```

Вы должны увидеть в `raw_user_meta_data`:
```json
{
  "name": "Admin",
  "role": "admin"
}
```

---

## ✅ Шаг 3: Проверьте доступ

1. Перейдите на http://localhost:3001/user-auth
2. Войдите с учетными данными администратора:
   - **Email**: admin@iwanna.com
   - **Пароль**: admin123
3. Попробуйте зайти в админку: http://localhost:3001/adminko
4. Если всё правильно - вы увидите админ-панель! 🎉

---

## 📋 Как это работает

### Проверка роли администратора:

```typescript
// В AuthContext
const isAdmin = user?.user_metadata?.role === 'admin' || false

// В ProtectedRoute
if (!isAdmin) {
  // Редирект на главную
}
```

### Типы пользователей:

| Тип | Роль | Доступ |
|-----|------|--------|
| **Обычный пользователь** | нет роли | Личный кабинет (`/profile`) |
| **Администратор** | `role: "admin"` | Админка (`/adminko`) + личный кабинет |

---

## 🔧 Дополнительно: Функция для автоматического создания админа

Если хотите автоматически назначать роль при регистрации определенного email:

```sql
-- Создайте функцию-триггер
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Если email = admin@iwanna.com, назначаем роль admin
  IF NEW.email = 'admin@iwanna.com' THEN
    NEW.raw_user_meta_data = 
      COALESCE(NEW.raw_user_meta_data, '{}'::jsonb) || 
      '{"role": "admin"}'::jsonb;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Создайте триггер
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

После этого при регистрации admin@iwanna.com автоматически получит роль администратора.

---

## 🎯 Готово!

Теперь у вас:
- ✅ Единая система авторизации для всех
- ✅ Разделение прав доступа по ролям
- ✅ Простое управление администраторами
- ✅ Безопасность через Supabase Auth

Если нужно добавить еще администраторов - просто повторите Шаг 2 для других пользователей! 🚀
