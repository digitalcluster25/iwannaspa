import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ewkeuupfristqqonkcph.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2V1dXBmcmlzdHFxb25rY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NDI0MDQsImV4cCI6MjA3NDQxODQwNH0.YduF49boh1jK40-Lk1nbie9JVtF0AsPyn_08JC-HX6E'

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  console.log('🚀 Running migration...')
  
  // Эта миграция должна быть выполнена напрямую в Supabase SQL Editor
  console.log('⚠️  Please run the migration SQL in Supabase SQL Editor:')
  console.log('   supabase/migrations/add_amenity_description_and_multiselect.sql')
  console.log('')
  console.log('After running the migration, update existing amenities with descriptions:')
  
  // Обновим существующие удобства с дефолтными описаниями
  const amenities = [
    { name: 'Бассейн', description: 'Крытый бассейн с подогревом и зоной отдыха' },
    { name: 'Сауна', description: 'Финская сауна с ароматерапией и вениками' },
    { name: 'Хаммам', description: 'Турецкая баня с традиционным паровым ритуалом' },
    { name: 'Джакузи', description: 'Гидромассажная ванна с различными режимами' },
    { name: 'Парковка', description: 'Бесплатная охраняемая парковка для гостей' },
    { name: 'Wi-Fi', description: 'Бесплатный высокоскоростной интернет' },
    { name: 'Кафе', description: 'Уютное кафе со здоровым меню и напитками' },
    { name: 'Раздевалка', description: 'Просторные раздевалки с индивидуальными шкафчиками' },
    { name: 'Душ', description: 'Современные душевые кабины с качественной косметикой' },
    { name: 'Релакс зона', description: 'Зона отдыха с комфортными лежаками и атмосферой релакса' }
  ]
  
  for (const amenity of amenities) {
    const { error } = await supabase
      .from('amenities')
      .update({ description: amenity.description })
      .eq('name', amenity.name)
    
    if (error) {
      console.error(`Error updating ${amenity.name}:`, error)
    } else {
      console.log(`✅ Updated: ${amenity.name}`)
    }
  }
  
  console.log('✅ Migration completed!')
}

runMigration()
