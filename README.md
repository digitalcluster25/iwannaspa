# Iwanna - Платформа бронирования СПА

Веб-платформа для поиска, бронирования и управления СПА комплексами.

---

## 🤖 Для AI-ассистентов

**Этот проект имеет специальные инструкции для AI:**

- **Claude (Projects/Desktop):** Читай `CLAUDE.md`
- **Cline (VS Code):** Читай `.clinerules`
- **Cursor IDE:** Читай `.cursorrules`
- **GitHub Copilot:** Читай `.github/copilot-instructions.md`

**Все AI ОБЯЗАНЫ:**
1. Прочитать `docs/prd.md` перед работой
2. Проверить `docs/logs.md` и `docs/TROUBLESHOOTING.md`
3. Обновлять документацию после изменений

---

## 📖 Документация

**⚠️ ВАЖНО: Перед началом работы прочитайте документацию!**

### Обязательные документы:

1. **[docs/prd.md](docs/prd.md)** - Product Requirements Document
   - 📌 **ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ О ПРОЕКТЕ**
   - Полное описание функционала
   - Структура базы данных
   - Роли и права доступа
   - Маршруты приложения

2. **[docs/logs.md](docs/logs.md)** - Журнал изменений
   - История всех изменений
   - **ВСЕ изменения ОБЯЗАТЕЛЬНО фиксируются здесь**

3. **[docs/README.md](docs/README.md)** - Инструкция для разработчика
   - Как начать работу
   - Структура проекта
   - Best practices
   - Workflow

4. **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Известные проблемы
   - Текущие баги и их решения
   - Технический долг
   - Workarounds

---

## 🚀 Быстрый старт

```bash
# Установка
npm install

# Создать .env
cp .env.example .env

# Заполнить VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY

# Запуск
npm run dev
```

**Дальше читайте [docs/README.md](docs/README.md)**

---

## 🏗️ Технологии

- **Frontend:** React 18, TypeScript, Vite
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **UI:** shadcn/ui, Tailwind CSS
- **Routing:** React Router v6

---

## 👥 Роли

- **Admin** - полный доступ ко всей системе
- **Vendor** - управление своими СПА после активации админом
- **User** - поиск и бронирование СПА

---

## 📋 Правила работы с проектом

### 1. docs/prd.md = ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ

**Всегда актуализируйте PRD при изменениях:**
- Изменили структуру БД? → Обновите PRD
- Добавили новый маршрут? → Обновите PRD
- Изменили права доступа? → Обновите PRD

### 2. Все изменения фиксируются в docs/logs.md

**Формат записи:**
```markdown
## [ДД.ММ.ГГГГ] - Краткое описание

### Изменено:
- Что конкретно изменилось

### Причина:
Почему было внесено изменение

### Файлы:
- `path/to/file.tsx` (создан/изменен/удален)
```

### 3. Перед коммитом:

```bash
# 1. Проверьте что код работает
npm run dev

# 2. Обновите документацию
# - docs/prd.md (если изменился функционал)
# - docs/logs.md (ОБЯЗАТЕЛЬНО!)

# 3. Коммит с понятным сообщением
git add .
git commit -m "feat: описание изменения"
git push
```

---

## 🗄️ База данных

### Основные таблицы:
- `profiles` - пользователи (с полем `active` для вендоров)
- `brands` - бренды (принадлежат вендорам)
- `spas` - СПА комплексы (привязаны к брендам)
- `spa_amenities` - удобства СПА (кастомные описания)
- `leads` - заявки на бронирование

### Миграции:
Все SQL миграции в папке `migrations/`

Выполнять в: Supabase Dashboard → SQL Editor

---

## 🛣️ Основные маршруты

### Публичные:
- `/` - Главная
- `/catalog` - Каталог СПА
- `/spa/:id` - Детальная страница СПА
- `/business` - Для вендоров

### Для вендоров:
- `/business/register` - Регистрация
- `/business/login` - Вход
- `/business/pending` - Ожидание модерации

### Админка:
- `/adminko` - СПА комплексы
- `/adminko/brands` - Бренды
- `/adminko/users` - Пользователи
- `/adminko/leads` - Заявки
- + справочники

---

## 🔴 Текущие проблемы

### КРИТИЧНО:
- **Медленная загрузка страниц** (>10 секунд)
  - Запросы к `profiles` зависают
  - Требуется исправление RLS политик
  - См. [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

### TODO:
- AdminSpaEdit: добавить выбор бренда
- Личный кабинет вендора (отдельный от админки)
- Интерфейс управления spa_amenities
- Фильтрация СПА для вендора

Полный список: [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

## 📁 Структура проекта

```
iwanna/
├── docs/                   # 📖 ДОКУМЕНТАЦИЯ (ЧИТАТЬ ПЕРВЫМ ДЕЛОМ!)
│   ├── prd.md             # ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ
│   ├── logs.md            # Журнал изменений
│   ├── README.md          # Инструкции для разработчика
│   └── TROUBLESHOOTING.md # Известные проблемы
│
├── migrations/            # SQL миграции
├── src/
│   ├── components/        # React компоненты
│   ├── contexts/          # React contexts (Auth)
│   ├── hooks/             # Кастомные хуки
│   ├── lib/               # Утилиты
│   ├── services/          # Бизнес-логика
│   └── types/             # TypeScript типы
│
└── package.json
```

---

## 🤝 Contribution Guidelines

1. Прочитайте [docs/README.md](docs/README.md)
2. Создайте feature branch
3. Внесите изменения
4. Обновите документацию (PRD + logs.md)
5. Создайте Pull Request

---

## 📞 Контакты

**Проект:** Iwanna  
**Документация:** `/docs`  
**Supabase Project:** ewkeuupfristqqonkcph

---

## ⚖️ License

[Указать лицензию]

---

*Последнее обновление: 03.10.2025*

**🎯 Начните с чтения [docs/prd.md](docs/prd.md)**
