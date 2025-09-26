#!/bin/bash

echo "📝 Коммитим изменения для Supabase интеграции..."

git add .
git commit -m "feat: добавлена интеграция с Supabase

- Добавлен @supabase/supabase-js клиент
- Создан SQL скрипт для БД (10 таблиц)
- Написаны сервисы для API (spas, leads, references)
- Созданы React хуки (useSpas, useLeads, useReferences)
- Добавлен скрипт миграции данных из моков
- Документация: SETUP_CHECKLIST, SUPABASE_SETUP, SETUP_SUMMARY"

echo "✅ Изменения закоммичены!"
echo ""
echo "📤 Отправляем на GitHub..."
git push origin main

echo "✅ Изменения отправлены на GitHub!"
