# Настройка Supabase для Iwanna SPA Catalog

## Шаг 1: Создание таблиц в Supabase

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект: `ewkeuupfristqqonkcph`
3. Перейдите в **SQL Editor** (левое меню)
4. Скопируйте содержимое файла `supabase/schema.sql`
5. Вставьте в SQL Editor и нажмите **Run**

## Шаг 2: Проверка таблиц

Перейдите в **Table Editor** и убедитесь, что созданы следующие таблицы:
- ✅ cities
- ✅ categories
- ✅ purposes
- ✅ amenities
- ✅ service_templates
- ✅ spas
- ✅ spa_services
- ✅ spa_amenities
- ✅ spa_contacts
- ✅ leads

## Шаг 3: Установка зависимостей

```bash
npm install
```

## Шаг 4: Проверка переменных окружения

Файл `.env.local` уже содержит нужные переменные:
```
VITE_SUPABASE_URL=https://ewkeuupfristqqonkcph.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
```

## Шаг 5: Запуск проекта

```bash
npm run dev
```

## Шаг 6: Миграция данных из моков

После создания таблиц, выполните миграцию:

```bash
npm run migrate:mock-data
```

## Структура API

### Сервисы
- `src/services/spaService.ts` - работа со СПА
- `src/services/leadService.ts` - работа с лидами
- `src/services/referenceService.ts` - работа со справочниками

### Хуки
- `src/hooks/useSpas.ts` - хуки для СПА
- `src/hooks/useLeads.ts` - хуки для лидов
- `src/hooks/useReferences.ts` - хуки для справочников

### Клиент Supabase
- `src/lib/supabase.ts` - настроенный клиент Supabase

## Проверка работы

1. Откройте браузер и перейдите на `http://localhost:5173`
2. Откройте консоль разработчика (F12)
3. Проверьте, что нет ошибок подключения к Supabase

## Troubleshooting

### Ошибка: "Missing Supabase environment variables"
- Проверьте, что `.env.local` существует
- Убедитесь, что переменные начинаются с `VITE_`

### Ошибка: "relation does not exist"
- Убедитесь, что SQL скрипт выполнен успешно
- Проверьте таблицы в Table Editor

### Ошибка: "Failed to fetch"
- Проверьте подключение к интернету
- Убедитесь, что Supabase URL корректен
