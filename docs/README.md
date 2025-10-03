# Iwanna - Инструкция для разработчика

## 🚀 Быстрый старт

### Требования
- Node.js 18+
- npm или yarn
- Git
- Аккаунт Supabase

### Установка

```bash
# Клонировать репозиторий
git clone [url]
cd iwanna

# Установить зависимости
npm install

# Создать .env файл
cp .env.example .env
```

### Конфигурация

Отредактируйте `.env`:
```env
VITE_SUPABASE_URL=https://ewkeuupfristqqonkcph.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Запуск

```bash
# Development сервер
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 📚 Документация

**ВАЖНО:** Перед работой ознакомьтесь с:

1. **`docs/prd.md`** - Product Requirements Document
   - Полное описание функционала
   - Структура БД
   - Роли пользователей
   - Маршруты приложения
   - **ЭТО ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ!**

2. **`docs/logs.md`** - Журнал изменений
   - История всех изменений
   - Причины изменений
   - Список затронутых файлов

3. **`docs/TROUBLESHOOTING.md`** - Известные проблемы
   - Текущие баги
   - Способы решения
   - Workarounds

---

## 🏗️ Структура проекта

```
iwanna/
├── docs/                   # 📖 Документация
│   ├── prd.md             # Product Requirements (ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ)
│   ├── logs.md            # Журнал изменений
│   ├── README.md          # Этот файл
│   └── TROUBLESHOOTING.md # Известные проблемы
│
├── migrations/            # 🗄️ SQL миграции для Supabase
│   ├── add-brands-system.sql
│   └── add-performance-indexes.sql
│
├── src/
│   ├── components/        # ⚛️ React компоненты
│   │   ├── AdminBrandsPage.tsx
│   │   ├── AdminUsersPage.tsx
│   │   ├── BusinessPage.tsx
│   │   ├── layout/
│   │   └── ui/           # shadcn/ui компоненты
│   │
│   ├── contexts/          # 🔐 React Contexts
│   │   └── AuthContext.tsx
│   │
│   ├── hooks/             # 🪝 Кастомные хуки
│   │   ├── useBrands.ts
│   │   └── useCountries.ts
│   │
│   ├── lib/               # 🛠️ Утилиты
│   │   └── supabase.ts   # Supabase client
│   │
│   ├── services/          # 💼 Бизнес-логика
│   │   ├── brandService.ts
│   │   └── spaService.ts
│   │
│   ├── types/             # 📝 TypeScript типы
│   │   └── spa.ts
│   │
│   ├── App.tsx           # Главный компонент с роутингом
│   └── main.tsx          # Entry point
│
├── supabase/             # ⚙️ Конфигурация Supabase
├── package.json
└── vite.config.ts
```

---

## 🔑 Ключевые концепции

### Роли пользователей

```typescript
type Role = 'admin' | 'vendor' | 'user'
```

- **admin** - полный доступ ко всей системе
- **vendor** - управление своими СПА после активации
- **user** - просмотр и бронирование СПА

### Статус вендора

```typescript
interface Profile {
  role: 'admin' | 'vendor' | 'user'
  active: boolean  // Только для вендоров!
}
```

- `vendor + active: false` → на модерации → `/business/pending`
- `vendor + active: true` → активен → доступ в `/adminko`

### Система брендов

```
Brand (принадлежит вендору)
  ↓
SPA (привязан к бренду)
  ↓
Amenities (удобства СПА)
```

---

## 🛠️ Работа с кодом

### Создание нового компонента

```bash
# В src/components/
touch src/components/NewComponent.tsx
```

```tsx
import { Button } from './ui/button'

export function NewComponent() {
  return (
    <div>
      <h1>New Component</h1>
    </div>
  )
}
```

### Добавление нового маршрута

1. Создать компонент
2. Добавить в `App.tsx`:

```tsx
import { NewComponent } from './components/NewComponent'

// В <Routes>
<Route path="/new-route" element={<NewComponent />} />
```

3. Обновить `docs/prd.md` - раздел "Маршруты"
4. Добавить запись в `docs/logs.md`

### Работа с Supabase

```typescript
import { supabase } from '@/lib/supabase'

// Запрос данных
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', 'value')

// Вставка
const { error } = await supabase
  .from('table_name')
  .insert({ column: 'value' })

// Обновление
const { error } = await supabase
  .from('table_name')
  .update({ column: 'new_value' })
  .eq('id', id)
```

### Создание сервиса

```typescript
// src/services/myService.ts
import { supabase } from '@/lib/supabase'

export const myService = {
  async getAll() {
    const { data, error } = await supabase
      .from('table')
      .select('*')
    if (error) throw error
    return data
  },
  
  async create(item: any) {
    const { data, error } = await supabase
      .from('table')
      .insert(item)
      .select()
      .single()
    if (error) throw error
    return data
  }
}
```

---

## 🗄️ Работа с базой данных

### Миграции

Все миграции хранятся в `migrations/`

**Создание миграции:**

1. Создайте файл `migrations/your-migration-name.sql`
2. Напишите SQL
3. Выполните в Supabase Dashboard → SQL Editor
4. Обновите `docs/prd.md` - раздел "Структура БД"
5. Добавьте запись в `docs/logs.md`

**Пример миграции:**

```sql
-- migrations/add-new-table.sql
CREATE TABLE IF NOT EXISTS my_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read"
  ON my_table FOR SELECT
  TO authenticated
  USING (true);
```

### Индексы

**Когда создавать индекс:**
- Частые запросы по полю
- Внешние ключи
- Поля для сортировки
- Поля для фильтрации

```sql
CREATE INDEX idx_table_column ON table(column);
CREATE INDEX idx_table_multiple ON table(col1, col2);
```

---

## ✅ Чеклист перед коммитом

- [ ] Код работает локально
- [ ] Нет console.error в production коде
- [ ] Обновлен `docs/prd.md` (если изменился функционал)
- [ ] Добавлена запись в `docs/logs.md`
- [ ] TypeScript не показывает ошибок
- [ ] Компоненты имеют понятные имена
- [ ] Нет дублирования кода

---

## 🧪 Тестирование

### Ручное тестирование

**Роли:**
1. Создайте тестовых пользователей:
   - Admin: admin@test.com
   - Vendor: vendor@test.com (активировать!)
   - User: user@test.com

2. Проверьте каждую роль:
   - Доступные маршруты
   - Видимость данных
   - CRUD операции

**Регистрация вендора:**
1. Зарегистрируйтесь через `/business/register`
2. Проверьте что попадаете на `/business/pending`
3. Активируйте от админа
4. Проверьте что попадаете в админку

---

## 🐛 Дебаггинг

### React DevTools

Установите расширение для браузера:
- Chrome: React Developer Tools
- Firefox: React Developer Tools

### Supabase Logs

Смотрите логи в Supabase Dashboard:
```
Project → Logs → выберите тип логов
```

### Console.log

Используйте префиксы для удобства:
```typescript
console.log('🔍 Debug:', data)
console.log('✅ Success:', data)
console.log('❌ Error:', error)
console.log('⚠️ Warning:', warning)
```

### Network Tab

Проверяйте запросы в DevTools → Network:
- Время выполнения
- Статус коды
- Payload
- Response

---

## 📦 Зависимости

### Основные

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "@supabase/supabase-js": "^2.x",
  "lucide-react": "^0.x"
}
```

### UI

```json
{
  "@radix-ui/*": "^1.x",  // Примитивы для shadcn/ui
  "tailwindcss": "^3.x",
  "class-variance-authority": "^0.x",
  "clsx": "^2.x"
}
```

### Добавление новой зависимости

```bash
npm install package-name

# После установки:
# 1. Обновите package.json
# 2. Добавьте запись в docs/logs.md
# 3. Закоммитьте изменения
```

---

## 🔐 Безопасность

### RLS (Row Level Security)

**Всегда включайте RLS для новых таблиц:**

```sql
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;
```

**Создавайте политики доступа:**

```sql
-- Чтение для всех
CREATE POLICY "read_policy" ON my_table
  FOR SELECT TO authenticated
  USING (true);

-- Изменение только своих записей
CREATE POLICY "update_own" ON my_table
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Админ может всё
CREATE POLICY "admin_all" ON my_table
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Переменные окружения

**НЕ коммитьте `.env`!**

Добавьте в `.gitignore`:
```
.env
.env.local
```

---

## 📝 Правила документирования

### 1. При ЛЮБОМ изменении:

```markdown
1. Внесите изменение в код
2. Обновите docs/prd.md (если изменился функционал)
3. Добавьте запись в docs/logs.md
4. Закоммитьте с понятным сообщением
```

### 2. Формат коммита:

```bash
git commit -m "feat: добавлена страница брендов"
git commit -m "fix: исправлена ошибка загрузки"
git commit -m "docs: обновлена документация"
```

Префиксы:
- `feat:` - новый функционал
- `fix:` - исправление бага
- `docs:` - изменение документации
- `refactor:` - рефакторинг кода
- `perf:` - оптимизация производительности
- `style:` - форматирование кода
- `test:` - добавление тестов

### 3. docs/prd.md - ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ

**Всегда актуализируйте:**
- Структуру БД
- Список маршрутов
- Роли и права доступа
- Статус реализации

---

## 🆘 Получение помощи

### Порядок действий при проблеме:

1. **Проверьте `docs/TROUBLESHOOTING.md`**
   - Возможно проблема уже известна

2. **Проверьте `docs/logs.md`**
   - Посмотрите последние изменения
   - Возможно проблема была внесена недавно

3. **Проверьте консоль браузера**
   - Ошибки JavaScript
   - Сетевые запросы

4. **Проверьте Supabase Dashboard**
   - Логи запросов
   - Ошибки БД

5. **Добавьте проблему в TROUBLESHOOTING.md**
   - Описание проблемы
   - Способ воспроизведения
   - Временное решение (workaround)

---

## 🎯 Best Practices

### React

```tsx
// ✅ Хорошо: Используйте функциональные компоненты
export function MyComponent() {
  const [state, setState] = useState()
  return <div></div>
}

// ✅ Хорошо: Деструктуризация props
export function MyComponent({ title, onSave }: Props) {
  return <div>{title}</div>
}

// ✅ Хорошо: Именуйте обработчики с префиксом handle
const handleClick = () => {}
const handleSubmit = () => {}
```

### TypeScript

```typescript
// ✅ Хорошо: Явные типы для функций
async function fetchUsers(): Promise<User[]> {
  // ...
}

// ✅ Хорошо: Интерфейсы для объектов
interface User {
  id: string
  name: string
  role: 'admin' | 'vendor' | 'user'
}

// ✅ Хорошо: Используйте типы из библиотек
import type { User } from '@supabase/supabase-js'
```

### Суп

abase

```typescript
// ✅ Хорошо: Обработка ошибок
const { data, error } = await supabase.from('table').select()
if (error) {
  console.error('Error:', error)
  toast.error('Ошибка загрузки данных')
  return
}

// ✅ Хорошо: Используйте .single() для одной записи
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single()
```

---

## 🔄 Workflow

### Ежедневная работа:

```bash
# 1. Обновить код
git pull origin main

# 2. Установить зависимости (если обновлялись)
npm install

# 3. Запустить dev сервер
npm run dev

# 4. Работать над задачей

# 5. Обновить документацию
# - docs/prd.md (если нужно)
# - docs/logs.md (обязательно!)

# 6. Коммит
git add .
git commit -m "feat: описание изменения"
git push origin main
```

---

## 📞 Контакты

**Проект:** Iwanna  
**Документация:** `/docs`  
**Supabase:** https://supabase.com/dashboard/project/ewkeuupfristqqonkcph

---

*Последнее обновление: 03.10.2025*
