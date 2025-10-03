import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { ArrowLeft, Save } from 'lucide-react'
import { useCountries } from '../hooks/useReferences'
import { countryService } from '../services/referenceService'
import { Country } from '../types/spa'
import { toast } from 'sonner'

export function AdminCountryEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id
  const { countries, refetch } = useCountries()

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    active: true,
  })
  const [loading, setLoading] = useState(false)

  // Отладочное логирование
  useEffect(() => {
    console.log('🔍 AdminCountryEdit mounted:', { id, isNew, countriesCount: countries.length })
  }, [id, isNew, countries.length])

  // Загружаем данные страны для редактирования
  useEffect(() => {
    if (!isNew && id) {
      console.log('🔍 Loading country for edit:', id)
      const country = countries.find(c => c.id === id)
      if (country) {
        console.log('✅ Found country:', country)
        setFormData({
          name: country.name,
          code: country.code,
          active: country.active,
        })
      } else {
        console.log('⚠️ Country not found:', id)
      }
    }
  }, [id, isNew, countries])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🔍 Form submitted with data:', formData)
    
    if (!formData.name.trim() || !formData.code.trim()) {
      console.log('❌ Validation failed: empty fields')
      toast.error('Заполните все обязательные поля')
      return
    }

    try {
      setLoading(true)
      console.log('🔄 Starting save process...')
      
      const countryData = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        active: formData.active,
      }
      
      console.log('📝 Saving country data:', countryData)
      
      if (isNew) {
        console.log('➕ Creating new country...')
        const result = await countryService.create(countryData)
        console.log('✅ Country created:', result)
        toast.success('Страна успешно создана')
      } else {
        console.log('✏️ Updating country:', id)
        const result = await countryService.update(id!, countryData)
        console.log('✅ Country updated:', result)
        toast.success('Страна успешно обновлена')
      }
      
      console.log('🔄 Refreshing countries list...')
      await refetch()
      
      console.log('🏠 Navigating to countries list...')
      navigate('/adminko/countries')
    } catch (error) {
      console.error('❌ Error saving country:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      toast.error(isNew ? 'Ошибка создания страны' : 'Ошибка обновления страны')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Навигация */}
      <div className="mb-6">
        <Link
          to="/adminko/countries"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Назад к списку стран
        </Link>
        <h1 className="text-2xl mt-2">
          {isNew ? 'Добавить страну' : 'Редактировать страну'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Debug: {isNew ? 'Creating new' : `Editing ${id}`} | Countries loaded: {countries.length}
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>
            {isNew ? 'Новая страна' : 'Редактирование страны'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Название страны *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => {
                  console.log('📝 Name changed:', e.target.value)
                  setFormData(prev => ({ ...prev, name: e.target.value }))
                }}
                placeholder="Например: Швейцария"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Код страны *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={e => {
                  console.log('📝 Code changed:', e.target.value)
                  setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))
                }}
                placeholder="Например: CH"
                maxLength={3}
                required
              />
              <p className="text-sm text-muted-foreground">
                Используйте ISO код страны (2-3 символа)
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="active">Активна</Label>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={checked => {
                  console.log('📝 Active changed:', checked)
                  setFormData(prev => ({ ...prev, active: checked }))
                }}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  console.log('🚪 Cancelling...')
                  navigate('/adminko/countries')
                }}
                disabled={loading}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Сохранение...' : (isNew ? 'Создать' : 'Сохранить')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}