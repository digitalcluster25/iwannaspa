/**
 * Скрипт для автоматической настройки администратора
 * Использование: node setup-admin.js
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Загружаем переменные окружения
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // ⚠️ Нужен service role key!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Ошибка: Не найдены переменные окружения')
  console.error('Нужны: VITE_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Создаем клиент с правами администратора
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupAdmin() {
  console.log('🚀 Настройка администратора...\n')

  const adminEmail = 'admin@iwanna.com'
  const adminPassword = 'admin123'
  const adminName = 'Admin'

  try {
    // Шаг 1: Проверяем, существует ли пользователь
    console.log('📋 Шаг 1: Проверка существующего пользователя...')
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === adminEmail)

    if (existingUser) {
      console.log('⚠️  Пользователь уже существует. Удаляем...')
      await supabase.auth.admin.deleteUser(existingUser.id)
      console.log('✅ Старый пользователь удален\n')
    }

    // Шаг 2: Создаем нового администратора
    console.log('📋 Шаг 2: Создание администратора...')
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Сразу подтверждаем email
      user_metadata: {
        name: adminName,
        role: 'admin' // ⭐ Роль администратора
      }
    })

    if (createError) {
      throw createError
    }

    console.log('✅ Администратор создан успешно!\n')

    // Шаг 3: Проверяем результат
    console.log('📋 Шаг 3: Проверка...')
    const { data: verifyUser } = await supabase.auth.admin.getUserById(newUser.user.id)

    console.log('\n✅ ГОТОВО! Данные администратора:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:', verifyUser.user.email)
    console.log('🔑 Пароль:', adminPassword)
    console.log('👤 Имя:', verifyUser.user.user_metadata.name)
    console.log('⭐ Роль:', verifyUser.user.user_metadata.role)
    console.log('✅ Email подтвержден:', verifyUser.user.email_confirmed_at ? 'Да' : 'Нет')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    console.log('🎉 Теперь можете войти:')
    console.log('   1. Откройте: http://localhost:3001/user-auth')
    console.log('   2. Войдите с admin@iwanna.com / admin123')
    console.log('   3. Откройте админку: http://localhost:3001/adminko\n')

  } catch (error) {
    console.error('❌ Ошибка:', error.message)
    process.exit(1)
  }
}

// Запускаем
setupAdmin()
