import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Загружаем .env.local
dotenv.config({ path: join(__dirname, '.env.local') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAmenities() {
  const spaId = 'e68aea4d-aff1-4b14-812c-65bdc11eb8a9'
  
  console.log('🔍 Checking SPA:', spaId)
  console.log('')
  
  // 1. Проверяем данные СПА
  const { data: spa, error: spaError } = await supabase
    .from('spas')
    .select('id, name')
    .eq('id', spaId)
    .single()
  
  if (spaError) {
    console.error('❌ Error fetching SPA:', spaError)
    return
  }
  
  console.log('✅ SPA found:', spa.name)
  console.log('')
  
  // 2. Проверяем связи spa_amenities
  const { data: spaAmenities, error: spaAmenitiesError } = await supabase
    .from('spa_amenities')
    .select('*')
    .eq('spa_id', spaId)
  
  if (spaAmenitiesError) {
    console.error('❌ Error fetching spa_amenities:', spaAmenitiesError)
  } else {
    console.log('📋 spa_amenities records:', spaAmenities.length)
    console.log(spaAmenities)
    console.log('')
  }
  
  // 3. Проверяем полный запрос как в приложении
  const { data: fullData, error: fullError } = await supabase
    .from('spas')
    .select(`
      *,
      city:cities(id, name),
      services:spa_services(*),
      amenities:spa_amenities(amenity:amenities(*)),
      contact:spa_contacts(*)
    `)
    .eq('id', spaId)
    .single()
  
  if (fullError) {
    console.error('❌ Error fetching full data:', fullError)
  } else {
    console.log('✅ Full query result:')
    console.log('Amenities:', JSON.stringify(fullData.amenities, null, 2))
  }
}

checkAmenities().catch(console.error)
