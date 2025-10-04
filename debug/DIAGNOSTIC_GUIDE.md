# Инструкция по диагностике проблемы загрузки

**Дата:** 03.10.2025  
**Проблема:** Страницы загружаются >10 секунд

---

## 🎯 Цель

Найти точную причину медленной загрузки и исправить.

---

## 📋 Шаг 1: Проверь статус RLS

### 1.1 Выполни SQL в Supabase:

https://supabase.com/dashboard/project/ewkeuupfristqqonkcph/sql/new

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';
```

**Ожидаемый результат:**
```
tablename | rowsecurity
----------|------------
profiles  | false
```

Если `rowsecurity = true` - RLS всё еще включен, нужно отключить:
```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

---

## 📋 Шаг 2: Тестовая страница диагностики

### 2.1 Открой страницу:

```
http://localhost:3001/debug
```

### 2.2 Нажми кнопки по порядку:

1. **"1. Тест подключения к БД"**
   - Проверяет работает ли вообще Supabase
   - Должно быть <500ms

2. **"2. Тест авторизации"**
   - Проверяет auth.getSession()
   - Должно быть <500ms

3. **"3. Тест запроса profiles"**
   - Проверяет SELECT * FROM profiles LIMIT 1
   - **Тут и есть проблема если >2000ms**

### 2.3 Смотри результаты:

**Хорошо (зеленый):** <500ms ✅  
**Медленно (желтый):** 500-2000ms ⚠️  
**Критично (красный):** >2000ms 🔴  

---

## 📋 Шаг 3: Проверь Supabase Dashboard

### 3.1 Открой Logs:

https://supabase.com/dashboard/project/ewkeuupfristqqonkcph/logs/postgres-logs

**Что искать:**
- Медленные запросы (slow queries)
- Ошибки подключения
- Таймауты

### 3.2 Открой Performance:

https://supabase.com/dashboard/project/ewkeuupfristqqonkcph/reports/database

**Что проверить:**
- Query performance (самые медленные запросы)
- Active connections (не переполнены ли?)
- Database load (нагрузка на БД)

---

## 📋 Шаг 4: Network анализ

### 4.1 Открой DevTools (F12) → Network

### 4.2 Обнови любую страницу админки

### 4.3 Найди запросы к Supabase:

Ищи запросы к `*.supabase.co`

**Смотри:**
- Время ответа (Time)
- Статус (Status)
- Размер (Size)

**Если запросы висят >10s:**
- Проблема с сетью или Supabase
- Возможно rate limiting
- Возможно проблемы с RLS

---

## 🔍 Возможные причины и решения

### Причина #1: RLS политики слишком сложные

**Симптомы:**
- После отключения RLS всё работает быстро
- В логах видны медленные policy проверки

**Решение:**
```sql
-- Временно отключаем RLS на всех таблицах
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE spas DISABLE ROW LEVEL SECURITY;
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- Проверяем скорость
-- Если стало быстро - проблема в RLS
-- Нужно переписать политики проще
```

---

### Причина #2: Отсутствие индексов

**Симптомы:**
- Запросы медленные даже без RLS
- В EXPLAIN видно Sequential Scan

**Решение:**
```sql
-- Уже добавлены индексы в migrations/add-performance-indexes.sql
-- Проверь что миграция выполнена:
SELECT * FROM pg_indexes WHERE schemaname = 'public';
```

---

### Причина #3: Проблемы с сетью до Supabase

**Симптомы:**
- Все запросы медленные
- Ping до Supabase >200ms

**Проверка:**
```bash
# В терминале
ping ewkeuupfristqqonkcph.supabase.co

# Должно быть <100ms
```

**Решение:**
- Проверить другую сеть
- Проверить VPN
- Проверить firewall

---

### Причина #4: Free tier ограничения Supabase

**Симптомы:**
- Медленно в определенное время
- В Dashboard видно Rate Limiting

**Решение:**
- Апгрейд на платный план
- Или оптимизировать количество запросов

---

### Причина #5: Множественные одновременные запросы

**Симптомы:**
- В Network видно 5-10 одинаковых запросов одновременно
- React делает useEffect несколько раз

**Решение:**
- Уже исправлено в AuthContext (кэширование)
- Проверить нет ли других мест с дублированием

---

## 📊 Сбор информации для отчета

После всех тестов собери:

1. **Результаты /debug:**
   - Скриншот с временем каждого теста
   - Особенно важен тест #3 (profiles)

2. **Результаты SQL проверок:**
   - Статус RLS (включен/выключен)
   - Наличие индексов

3. **Network timing:**
   - Скриншот медленных запросов
   - Время каждого запроса

4. **Supabase Dashboard:**
   - Query performance
   - Slow queries
   - Errors

5. **Окружение:**
   - Интернет провайдер
   - Используешь ли VPN
   - Браузер и версия

---

## 🎯 Следующие шаги по результатам

### Если /debug показывает <500ms на все тесты:
✅ **Проблема не в БД/сети**
- Проблема в коде приложения
- Смотреть AuthContext
- Смотреть множественные рендеры

### Если /debug показывает >2000ms на тест #3:
🔴 **Проблема в запросе profiles**
- Проверить RLS
- Проверить индексы
- Проверить сеть

### Если /debug показывает >2000ms на тест #1:
🔴 **Проблема с подключением к Supabase**
- Проверить сеть
- Проверить Supabase status
- Попробовать другую сеть

---

## 💡 Быстрые workarounds

### Workaround #1: Отключить RLS везде

```sql
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE 'ALTER TABLE ' || quote_ident(r.tablename) || ' DISABLE ROW LEVEL SECURITY';
    END LOOP;
END $$;
```

⚠️ **Только для development! Не использовать в production!**

### Workaround #2: Добавить кэш на клиенте

Уже реализовано в AuthContext через `profileCache`.

### Workaround #3: Lazy loading

Загружать данные по требованию, а не все сразу.

---

## 📞 Если ничего не помогло

1. Проверь https://status.supabase.com - может Supabase down
2. Попробуй создать новый Supabase проект и тестировать там
3. Обратись в Supabase Support с результатами диагностики

---

*Создано: 03.10.2025*
