# ✅ Чеклист для настройки Supabase

## 🎯 Этап 1: Создание таблиц в Supabase (5 минут)

1. **Открыть Supabase Dashboard**
   - Перейти: https://supabase.com/dashboard/project/ewkeuupfristqqonkcph
   
2. **Открыть SQL Editor**
   - В левом меню выбрать: **SQL Editor** (иконка )
   - Или прямая ссылка: https://supabase.com/dashboard/project/ewkeuupfristqqonkcph/sql/new

3. **Выполнить SQL скрипт**
   - Открыть файл `supabase/schema.sql` в вашем проекте
   - Скопировать весь его содержимый (Ctrl+A → Ctrl+C)
   - Вставить в SQL Editor в Supabase (Ctrl+V)
   - Нажать **Run** (или Ctrl+Enter)
   - Дождаться сообщения "Success. No rows returned"

4. **Проверить таблицы**
   - В левом меню выбрать: **Table Editor**
   - Должны появиться 10 таблиц:
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

---

## 🎯 Этап 2: Установка зависимостей (2 минуты)

```bash
npm install
```

---

## 🎯 Этап 3: Миграция данных из моков (1 минута)

```bash
npm run migrate:mock-data
```

**Что произойдет:**
- Все данные из `mockData.ts` загрузятся в Supabase
- 8 СПА комплексов с услугами и контактами
- 4 города
- 4 категории
- 5 назначений
- 30 удобств
- 20 шаблонов услуг

**Проверка:**
- Откройте Table Editor в Supabase
- Перейдите в таблицу `spas`
- Должны увидеть 8 записей

---

## 🎯 Этап 4: Запуск проекта (30 секунд)

```bash
npm run dev
```

Откройте: http://localhost:5173

**Проверка:**
- Откройте консоль браузера (F12)
- Не должно быть ошибок "Failed to fetch" или "Missing Supabase"
- Перейдите на страницу `/catalog`
- Должны отобразиться 8 СПА из базы данных

---

## 🎯 Этап 5: Интеграция с компонентами

### Файлы уже готовы:
- ✅ `src/lib/supabase.ts` - клиент Supabase
- ✅ `src/services/spaService.ts` - API для СПА
- ✅ `src/services/leadService.ts` - API для лидов
- ✅ `src/services/referenceService.ts` - API для справочников
- ✅ `src/hooks/useSpas.ts` - React хуки для СПА
- ✅ `src/hooks/useLeads.ts` - React хуки для лидов
- ✅ `src/hooks/useReferences.ts` - React хуки для справочников

### Что нужно сделать:
**Теперь мы заменим моки на реальные данные из Supabase в компонентах!**

---

## 📋 Статус

- [x] Supabase клиент настроен
- [x] SQL схема создана
- [x] Сервисы написаны
- [x] React хуки готовы
- [x] Скрипт миграции создан
- [ ] Создать таблицы в Supabase ← **СЛЕДУЮЩИЙ ШАГ**
- [ ] Мигрировать данные
- [ ] Интегрировать с компонентами

---

## 🚨 Возможные проблемы

### Ошибка при создании таблиц
**Решение:** Убедитесь, что копировали весь SQL скрипт полностью

### Ошибка "Missing Supabase environment variables"
**Решение:** Проверьте, что `.env.local` содержит:
```
VITE_SUPABASE_URL=https://ewkeuupfristqqonkcph.supabase.co
VITE_SUPABASE_ANON_KEY=ваш-ключ
```

### Ошибка при миграции "relation does not exist"
**Решение:** Сначала создайте таблицы в Supabase (Этап 1)

---

## 🎬 Готовы начать?

**Начните с Этапа 1** - создайте таблицы в Supabase!

После завершения скажите: "Таблицы созданы" и я помогу с интеграцией компонентов.
