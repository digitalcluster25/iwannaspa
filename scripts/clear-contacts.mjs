import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'

const supabase = createClient(supabaseUrl, supabaseKey)

async function clearContacts() {
  console.log('🗑️  Удаляем все контакты...')
  
  const { error } = await supabase
    .from('spa_contacts')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Удаляем все
  
  if (error) {
    console.error('Ошибка:', error)
  } else {
    console.log('✅ Все контакты удалены')
  }
}

clearContacts()
