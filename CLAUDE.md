# Claude Project Instructions - Iwanna

> Этот файл содержит инструкции для Claude при работе через Claude Projects или Claude Desktop

## 🎯 Первоочередные действия

При начале работы с проектом **ОБЯЗАТЕЛЬНО** прочитай:

### 1. docs/prd.md - ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ
- Полное описание всех функций
- Структура базы данных
- Роли и права доступа
- Текущий статус реализации

### 2. docs/logs.md - История изменений
- Все изменения в проекте
- Последние 5-10 записей особенно важны

### 3. docs/TROUBLESHOOTING.md - Известные проблемы
- Критические баги и их статус
- Что уже пробовали
- Workarounds

---

## 📌 Ключевая информация

### Технологии
```
Frontend: React 18 + TypeScript + Vite
Backend:  Supabase (PostgreSQL, Auth, Storage)
UI:       shadcn/ui + Tailwind CSS
Routing:  React Router v6
```

### Роли пользователей
```typescript
'admin'  // Полный доступ
'vendor' // Управление СПА (после активации)
'user'   // Просмотр и бронирование
```

### Критическая концепция: Активация вендоров
```
1. Вендор регистрируется → profiles.active = false
2. Попадает на /business/pending
3. Админ активирует → active = true
4. Вендор получает доступ в админку
```

### Система брендов
```
Vendor (owner_id)
    ↓
  Brand
    ↓
   SPA
    ↓
Amenities
```

---

## 🚨 КРИТИЧЕСКИЕ ПРОБЛЕМЫ

### 🔴 Проблема #1: Медленная загрузка страниц

**Статус:** НЕ РЕШЕНО  
**Симптомы:** Страницы загружаются >10 секунд  
**Причина:** Запросы к `profiles` зависают  

**Что пробовали:**
- ✅ Оптимизация AuthContext
- ✅ Добавление индексов БД
- ⚠️ Отключение RLS (тестируется)

**Полная информация:** `docs/TROUBLESHOOTING.md`

---

## ⚠️ ОБЯЗАТЕЛЬНЫЕ ПРАВИЛА

### Правило #1: docs/prd.md = Единый источник правды

**ВСЕГДА:**
- Проверяй PRD перед изменениями
- Обновляй PRD после изменений
- Не противоречь PRD

**Если PRD устарел** - скажи пользователю и предложи обновить.

### Правило #2: Фиксируй ВСЕ изменения

После КАЖДОГО изменения добавь запись в `docs/logs.md`:

```markdown
## [03.10.2025] - Краткое описание

### Изменено:
- Конкретные изменения

### Причина:
Почему это было нужно

### Файлы:
- `path/to/file.tsx` (создан/изменен/удален)
```

### Правило #3: Проверяй TROUBLESHOOTING.md

Перед исправлением бага:
1. Прочитай `docs/TROUBLESHOOTING.md`
2. Проверь не известна ли проблема
3. Используй существующие workarounds
4. Не дублируй работу

---

## 📁 Структура проекта

```
iwanna/
├── docs/                    # 📖 ДОКУМЕНТАЦИЯ
│   ├── prd.md              # Единый источник правды
│   ├── logs.md             # Журнал изменений
│   ├── README.md           # Инструкции
│   └── TROUBLESHOOTING.md  # Известные проблемы
│
├── migrations/             # SQL миграции
│
├── src/
│   ├── components/         # React компоненты
│   ├── contexts/          # AuthContext
│   ├── hooks/             # useBrands, useCountries
│   ├── lib/               # supabase client
│   ├── services/          # brandService, spaService
│   └── types/             # TypeScript типы
```

---

## 🗄️ База данных

### Основные таблицы:

**profiles**
```sql
id       UUID PRIMARY KEY (FK → auth.users)
role     TEXT (admin/vendor/user)
active   BOOLEAN (для вендоров!)
```

**brands**
```sql
id          UUID PRIMARY KEY
name        TEXT NOT NULL
owner_id    UUID (FK → profiles) -- Владелец (вендор)
active      BOOLEAN
```

**spas**
```sql
id          UUID PRIMARY KEY
name        TEXT NOT NULL
brand_id    UUID (FK → brands)
active      BOOLEAN
```

**spa_amenities**
```sql
spa_id              UUID (FK → spas)
amenity_id          UUID (FK → amenities)
custom_description  TEXT  -- Кастомное описание от вендора
```

**leads**
```sql
id         UUID PRIMARY KEY
spa_id     UUID (FK → spas)
status     TEXT (new/contacted/confirmed/cancelled)
```

---

## 🛣️ Ключевые маршруты

### Публичные:
```
/                    - Главная
/catalog            - Каталог СПА
/spa/:id            - Детальная страница
/business           - Информация для вендоров
```

### Для вендоров:
```
/business/register  - Регистрация вендора
/business/login     - Вход вендора
/business/pending   - Ожидание модерации (active: false)
```

### Админка:
```
/adminko            - СПА комплексы
/adminko/brands     - Бренды (привязка к вендорам)
/adminko/users      - Пользователи (активация вендоров)
/adminko/leads      - Заявки
+ справочники (countries, cities, categories, etc.)
```

---

## ✅ Чеклист перед ответом

- [ ] Прочитал `docs/prd.md`
- [ ] Проверил `docs/logs.md` (последние изменения)
- [ ] Проверил `docs/TROUBLESHOOTING.md` (известные проблемы)
- [ ] Решение не противоречит PRD
- [ ] Напомнил пользователю обновить документацию

---

## 💻 Примеры типовых задач

### Добавление нового роута:
1. Создать компонент
2. Добавить в `App.tsx`
3. **Обновить раздел "Маршруты" в PRD**
4. **Добавить запись в logs.md**

### Исправление бага:
1. **Проверить TROUBLESHOOTING.md**
2. Если известен - использовать workaround
3. Исправить
4. **Обновить статус в TROUBLESHOOTING.md**
5. **Добавить запись в logs.md**

### Изменение БД:
1. Создать миграцию в `migrations/`
2. **Обновить раздел "Структура БД" в PRD**
3. Создать/обновить сервис
4. **Добавить запись в logs.md**

---

## 🎯 Приоритеты

1. Критические проблемы (TROUBLESHOOTING.md)
2. Функционал высокого приоритета (PRD)
3. Технический долг (TROUBLESHOOTING.md)
4. Новые фичи

---

## 📝 Формат коммитов

```
feat: добавлена страница брендов
fix: исправлена ошибка загрузки
docs: обновлена документация PRD
refactor: оптимизирован AuthContext
perf: добавлены индексы БД
style: форматирование кода
test: добавлены тесты
```

---

## 🔗 Быстрые ссылки

- [PRD](docs/prd.md) - ГЛАВНОЕ!
- [Журнал](docs/logs.md)
- [Проблемы](docs/TROUBLESHOOTING.md)
- [Инструкции](docs/README.md)

---

## ⚡ Важные напоминания

1. **ВСЕГДА** читай документацию перед работой
2. **ВСЕГДА** обновляй документацию после изменений
3. **НЕ** предлагай то, что уже пробовали (TROUBLESHOOTING.md)
4. **НЕ** противоречь PRD
5. **ПРОВЕРЯЙ** соответствие изменений PRD

---

**Версия:** 1.0  
**Дата:** 03.10.2025  
**Проект:** Iwanna - Платформа бронирования СПА
