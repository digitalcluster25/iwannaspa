import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Separator } from './ui/separator'

import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
// import { mockSpas, mockCities, mockCategories, mockPurposes, mockAmenities, mockServiceTemplates } from '../data/mockData'; // Закомментировано
import { useSpa, useSpaActions } from '../hooks/useSpas'
import {
  useCities,
  useCategories,
  usePurposes,
  useAmenities,
  useServiceTemplates,
} from '../hooks/useReferences'
import { Spa, SpaService, ContactInfo } from '../types/spa'
import { toast } from 'sonner'

export function AdminSpaEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const isNew = !id

  // Получаем активную вкладку из URL или устанавливаем по умолчанию
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'basic')

  // Обновляем вкладку при изменении URL
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Обновляем URL при смене вкладки
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setSearchParams({ tab: value })
  }

  // Получаем данные из Supabase
  const { spa, loading: spaLoading } = useSpa(id)
  const { cities, loading: citiesLoading } = useCities()
  const { categories, loading: categoriesLoading } = useCategories()
  const { purposes, loading: purposesLoading } = usePurposes()
  const { amenities, loading: amenitiesLoading } = useAmenities()
  const { services: serviceTemplates, loading: servicesLoading } =
    useServiceTemplates()
  const { createSpa, updateSpa, loading: saving } = useSpaActions()

  const [formData, setFormData] = useState<Partial<Spa>>({
    name: '',
    description: '',
    location: '',
    address: '',
    addressComment: '',
    latitude: undefined,
    longitude: undefined,
    categories: [], // Массив для мультивыбора
    purposes: [], // Массив для мультивыбора
    category: 'wellness', // Для обратной совместимости
    purpose: 'relaxation', // Для обратной совместимости
    price: 0,
    rating: 5.0,
    reviewCount: 0,
    images: [''],
    amenities: [],
    services: [],
    contactInfo: {
      phone: '',
      email: '',
      workingHours: '',
      whatsapp: '',
      telegram: '',
    },
    featured: false,
    active: true,
  })

  const [selectedAmenityId, setSelectedAmenityId] = useState('')
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [newService, setNewService] = useState<Partial<SpaService>>({
    name: '',
    description: '',
    price: 0,
    image: '',
  })

  useEffect(() => {
    if (!isNew && spa) {
      setFormData({
        ...spa,
        // Инициализируем categories и purposes для мультивыбора
        categories: spa.categories || (spa.category ? [spa.category] : []),
        purposes: spa.purposes || (spa.purpose ? [spa.purpose] : []),
      })
    }
  }, [spa, isNew])

  const categoryOptions = categories.filter(cat => cat.active)
  const locationOptions = cities.filter(city => city.active)
  const purposeOptions = purposes.filter(purpose => purpose.active)
  const amenityOptions = amenities.filter(amenity => amenity.active)
  const serviceTemplateOptions = serviceTemplates.filter(
    service => service.active
  )

  const handleInputChange = (field: keyof Spa, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [''])]
    newImages[index] = value
    setFormData(prev => ({
      ...prev,
      images: newImages,
    }))
  }

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ''],
    }))
  }

  const removeImage = (index: number) => {
    const newImages = formData.images?.filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      images: newImages || [''],
    }))
  }

  const addAmenity = () => {
    if (selectedAmenityId) {
      const selectedAmenity = amenityOptions.find(
        a => a.id === selectedAmenityId
      )
      if (
        selectedAmenity &&
        !formData.amenities?.includes(selectedAmenity.name)
      ) {
        setFormData(prev => ({
          ...prev,
          amenities: [...(prev.amenities || []), selectedAmenity.name],
        }))
        setSelectedAmenityId('')
      }
    }
  }

  const removeAmenity = (index: number) => {
    const newAmenities = formData.amenities?.filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      amenities: newAmenities || [],
    }))
  }

  const addService = () => {
    if (selectedServiceId && newService.description && newService.price) {
      const selectedTemplate = serviceTemplateOptions.find(
        s => s.id === selectedServiceId
      )
      if (selectedTemplate) {
        const serviceToAdd: SpaService = {
          id: `service-${Date.now()}`,
          name: selectedTemplate.name,
          description: newService.description || '',
          price: newService.price || 0,
          image: newService.image || '/api/placeholder/80/80',
        }

        setFormData(prev => ({
          ...prev,
          services: [...(prev.services || []), serviceToAdd],
        }))

        setSelectedServiceId('')
        setNewService({
          name: '',
          description: '',
          price: 0,
          image: '',
        })
      }
    }
  }

  const removeService = (index: number) => {
    const newServices = formData.services?.filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      services: newServices || [],
    }))
  }

  const updateService = (
    index: number,
    field: keyof SpaService,
    value: any
  ) => {
    const newServices = [...(formData.services || [])]
    newServices[index] = { ...newServices[index], [field]: value }
    setFormData(prev => ({
      ...prev,
      services: newServices,
    }))
  }

  const handleContactInfoChange = (field: keyof ContactInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo!,
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Сохраняем текущую вкладку
    const currentTab =
      new URLSearchParams(window.location.search).get('tab') || 'basic'

    try {
      const spaData: Partial<Spa> = {
        name: formData.name || '',
        description: formData.description || '',
        location: formData.location || '',
        address: formData.address,
        addressComment: formData.addressComment,
        latitude: formData.latitude,
        longitude: formData.longitude,
        categories: formData.categories || [],
        purposes: formData.purposes || [],
        category:
          (formData.categories && formData.categories[0]) ||
          (formData.category as any),
        purpose:
          (formData.purposes && formData.purposes[0]) ||
          (formData.purpose as any),
        price: formData.price || 0,
        rating: formData.rating || 5.0,
        reviewCount: formData.reviewCount || 0,
        images: formData.images?.filter(img => img.trim()) || [],
        amenities: formData.amenities || [],
        services: formData.services || [],
        contactInfo: formData.contactInfo || {
          phone: '',
          email: '',
          workingHours: '',
        },
        featured: formData.featured || false,
        active: formData.active ?? true,
      }

      if (isNew) {
        const newSpa = await createSpa(spaData)
        toast.success('СПА успешно создан')
        // Для нового СПА переходим на страницу редактирования с той же вкладкой
        navigate(`/admin/spa/${newSpa.id}/edit?tab=${currentTab}`)
      } else {
        await updateSpa(id!, spaData)
        toast.success('СПА успешно обновлен')
        // Остаемся на той же странице с той же вкладкой
        navigate(`/admin/spa/${id}/edit?tab=${currentTab}`, { replace: true })
      }
    } catch (error) {
      console.error('Error saving SPA:', error)
      toast.error(isNew ? 'Ошибка создания СПА' : 'Ошибка обновления СПА')
    }
  }

  // Loading состояние
  const isLoading =
    spaLoading ||
    citiesLoading ||
    categoriesLoading ||
    purposesLoading ||
    amenitiesLoading ||
    servicesLoading

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      {/* Back Button */}
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад к списку
      </Link>

      <div className="w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl mb-2">
              {isNew
                ? 'Создание СПА комплекса'
                : 'Редактирование СПА комплекса'}
            </h1>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-4">
            {!isNew && (
              <Link to={`/spa/${id}`} target="_blank">
                <Button type="button" variant="outline">
                  👁️ Просмотр на сайте
                </Button>
              </Link>
            )}
            <Link to="/admin">
              <Button type="button" variant="outline">
                Отмена
              </Button>
            </Link>
            <Button type="submit" form="spa-form" size="lg" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving
                ? 'Сохранение...'
                : isNew
                  ? 'Создать СПА'
                  : 'Сохранить изменения'}
            </Button>
          </div>
        </div>

        <form id="spa-form" onSubmit={handleSubmit}>
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="flex justify-end mb-6">
              <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                <TabsTrigger value="basic">Основное</TabsTrigger>
                <TabsTrigger value="images">Изображения</TabsTrigger>
                <TabsTrigger value="location">Местоположение</TabsTrigger>
                <TabsTrigger value="amenities">Удобства</TabsTrigger>
                <TabsTrigger value="services">Услуги</TabsTrigger>
                <TabsTrigger value="contacts">Контакты</TabsTrigger>
                <TabsTrigger value="settings">Настройки</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="basic" className="mt-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Название СПА *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={e =>
                          handleInputChange('name', e.target.value)
                        }
                        placeholder="Введите название СПА комплекса"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Город *</Label>
                      <Select
                        value={formData.location}
                        onValueChange={value =>
                          handleInputChange('location', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите город" />
                        </SelectTrigger>
                        <SelectContent>
                          {locationOptions.map(location => (
                            <SelectItem key={location.id} value={location.name}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Описание *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={e =>
                        handleInputChange('description', e.target.value)
                      }
                      placeholder="Введите описание СПА комплекса"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label>Категории * (выберите одну или несколько)</Label>
                      <div className="space-y-2 p-3 border rounded-md">
                        {categoryOptions.map(category => {
                          const isChecked =
                            formData.categories?.includes(
                              category.value as any
                            ) || false
                          return (
                            <div
                              key={category.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                id={`category-${category.id}`}
                                checked={isChecked}
                                onChange={e => {
                                  const newCategories = e.target.checked
                                    ? [
                                        ...(formData.categories || []),
                                        category.value as any,
                                      ]
                                    : (formData.categories || []).filter(
                                        c => c !== category.value
                                      )
                                  setFormData(prev => ({
                                    ...prev,
                                    categories: newCategories,
                                    category:
                                      (newCategories[0] as any) || 'wellness', // Первая для совместимости
                                  }))
                                }}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              <Label
                                htmlFor={`category-${category.id}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {category.name}
                              </Label>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Цели * (выберите одну или несколько)</Label>
                      <div className="space-y-2 p-3 border rounded-md">
                        {purposeOptions.map(purpose => {
                          const isChecked =
                            formData.purposes?.includes(purpose.value as any) ||
                            false
                          return (
                            <div
                              key={purpose.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                id={`purpose-${purpose.id}`}
                                checked={isChecked}
                                onChange={e => {
                                  const newPurposes = e.target.checked
                                    ? [
                                        ...(formData.purposes || []),
                                        purpose.value as any,
                                      ]
                                    : (formData.purposes || []).filter(
                                        p => p !== purpose.value
                                      )
                                  setFormData(prev => ({
                                    ...prev,
                                    purposes: newPurposes,
                                    purpose:
                                      (newPurposes[0] as any) || 'relaxation', // Первая для совместимости
                                  }))
                                }}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                              <Label
                                htmlFor={`purpose-${purpose.id}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {purpose.name}
                              </Label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="mt-6">
              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle>Местоположение и карта</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="address">Полный адрес</Label>
                    <Input
                      id="address"
                      value={formData.address || ''}
                      onChange={e =>
                        handleInputChange('address', e.target.value)
                      }
                      placeholder="ул. Примерная, 123, Киев, 01001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressComment">Комментарий к адресу</Label>
                    <Textarea
                      id="addressComment"
                      value={formData.addressComment || ''}
                      onChange={e =>
                        handleInputChange('addressComment', e.target.value)
                      }
                      placeholder="Например: Центральное расположение, 5 минут от метро"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Широта (Latitude)</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="0.000001"
                        value={formData.latitude || ''}
                        onChange={e =>
                          handleInputChange(
                            'latitude',
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                        placeholder="50.450100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Долгота (Longitude)</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.000001"
                        value={formData.longitude || ''}
                        onChange={e =>
                          handleInputChange(
                            'longitude',
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                        placeholder="30.523400"
                      />
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Совет:</strong> Чтобы получить координаты:
                    </p>
                    <ol className="text-sm text-muted-foreground space-y-1 ml-4 list-decimal">
                      <li>
                        Откройте{' '}
                        <a
                          href="https://www.google.com/maps"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          Google Maps
                        </a>
                      </li>
                      <li>Найдите нужное место на карте</li>
                      <li>Кликните правой кнопкой мыши на метке</li>
                      <li>
                        Скопируйте координаты (первое число - широта, второе -
                        долгота)
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="mt-6">
              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Изображения</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.images?.map((image, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Input
                        value={image}
                        onChange={e => handleImageChange(index, e.target.value)}
                        placeholder="URL изображения"
                        className="flex-1"
                      />
                      {formData.images && formData.images.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addImage}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить изображение
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="amenities" className="mt-6">
              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Удобства</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Select
                      value={selectedAmenityId}
                      onValueChange={setSelectedAmenityId}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Выберите удобство" />
                      </SelectTrigger>
                      <SelectContent>
                        {amenityOptions
                          .filter(
                            amenity =>
                              !formData.amenities?.includes(amenity.name)
                          )
                          .map(amenity => (
                            <SelectItem key={amenity.id} value={amenity.id}>
                              {amenity.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={addAmenity}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.amenities && formData.amenities.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Существующие удобства</h4>
                      <div className="grid gap-4">
                        {formData.amenities.map((amenity, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <Input
                              value={amenity}
                              onChange={e => {
                                const newAmenities = [
                                  ...(formData.amenities || []),
                                ]
                                newAmenities[index] = e.target.value
                                setFormData(prev => ({
                                  ...prev,
                                  amenities: newAmenities,
                                }))
                              }}
                              className="flex-1 mr-3"
                              placeholder="Название удобства"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeAmenity(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle>СПА услуги</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add New Service */}
                  <div className="p-4 border rounded-lg space-y-4">
                    <h4 className="font-medium">Добавить новую услугу</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Название услуги</Label>
                        <Select
                          value={selectedServiceId}
                          onValueChange={value => {
                            setSelectedServiceId(value)
                            const template = serviceTemplateOptions.find(
                              s => s.id === value
                            )
                            if (template) {
                              setNewService(prev => ({
                                ...prev,
                                name: template.name,
                              }))
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите услугу" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceTemplateOptions.map(service => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Цена (₴)</Label>
                        <Input
                          type="number"
                          value={newService.price}
                          onChange={e =>
                            setNewService(prev => ({
                              ...prev,
                              price: parseInt(e.target.value) || 0,
                            }))
                          }
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Описание</Label>
                      <Textarea
                        value={newService.description}
                        onChange={e =>
                          setNewService(prev => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Описание услуги"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Изображение (URL)</Label>
                      <Input
                        value={newService.image}
                        onChange={e =>
                          setNewService(prev => ({
                            ...prev,
                            image: e.target.value,
                          }))
                        }
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addService}
                      disabled={
                        !selectedServiceId ||
                        !newService.description ||
                        !newService.price
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить услугу
                    </Button>
                  </div>

                  {/* Existing Services */}
                  {formData.services && formData.services.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Существующие услуги</h4>
                      {formData.services.map((service, index) => (
                        <div
                          key={service.id}
                          className="p-4 border rounded-lg space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">Услуга #{index + 1}</h5>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeService(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Название</Label>
                              <Input
                                value={service.name}
                                onChange={e =>
                                  updateService(index, 'name', e.target.value)
                                }
                                placeholder="Название услуги"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Цена (₴)</Label>
                              <Input
                                type="number"
                                value={service.price}
                                onChange={e =>
                                  updateService(
                                    index,
                                    'price',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                placeholder="0"
                                min="0"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Описание</Label>
                            <Textarea
                              value={service.description}
                              onChange={e =>
                                updateService(
                                  index,
                                  'description',
                                  e.target.value
                                )
                              }
                              placeholder="Описание услуги"
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Изображение (URL)</Label>
                            <Input
                              value={service.image}
                              onChange={e =>
                                updateService(index, 'image', e.target.value)
                              }
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts" className="mt-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Контактная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input
                        id="phone"
                        value={formData.contactInfo?.phone || ''}
                        onChange={e =>
                          handleContactInfoChange('phone', e.target.value)
                        }
                        placeholder="+380 XX XXX XX XX"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.contactInfo?.email || ''}
                        onChange={e =>
                          handleContactInfoChange('email', e.target.value)
                        }
                        placeholder="info@spa.ua"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={formData.contactInfo?.whatsapp || ''}
                        onChange={e =>
                          handleContactInfoChange('whatsapp', e.target.value)
                        }
                        placeholder="+380 XX XXX XX XX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telegram">Telegram</Label>
                      <Input
                        id="telegram"
                        value={formData.contactInfo?.telegram || ''}
                        onChange={e =>
                          handleContactInfoChange('telegram', e.target.value)
                        }
                        placeholder="@username или ссылка"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workingHours">Режим работы *</Label>
                    <Input
                      id="workingHours"
                      value={formData.contactInfo?.workingHours || ''}
                      onChange={e =>
                        handleContactInfoChange('workingHours', e.target.value)
                      }
                      placeholder="Пн-Вс 9:00 - 22:00"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Настройки</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Рекомендуемый</Label>
                      <div className="text-sm text-muted-foreground">
                        Показывать СПА в блоке рекомендаций
                      </div>
                    </div>
                    <Switch
                      checked={formData.featured}
                      onCheckedChange={checked =>
                        handleInputChange('featured', checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Активен</Label>
                      <div className="text-sm text-muted-foreground">
                        Показывать СПА в каталоге
                      </div>
                    </div>
                    <Switch
                      checked={formData.active}
                      onCheckedChange={checked =>
                        handleInputChange('active', checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  )
}
