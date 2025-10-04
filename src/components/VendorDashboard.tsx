import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { 
  Building, 
  MapPin, 
  Star, 
  Users, 
  Calendar,
  Plus,
  Edit,
  Eye
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useSpas } from '@/hooks/useSpas'
import { useBrands } from '@/hooks/useBrands'
import { useUserLeads } from '@/hooks/useUserLeads'
import { toast } from 'sonner'

export function VendorDashboard() {
  const { user, profile } = useAuth()
  const { spas, loading: spasLoading } = useSpas()
  const { brands, loading: brandsLoading } = useBrands()
  const { leads, loading: leadsLoading } = useUserLeads()

  // Статистика
  const totalSpas = spas.length
  const activeSpas = spas.filter(spa => spa.active).length
  const totalLeads = leads.length
  const newLeads = leads.filter(lead => lead.status === 'new').length

  const categoryLabels = {
    wellness: 'Wellness',
    thermal: 'Термальный',
    medical: 'Медицинский',
    beauty: 'Beauty',
  }

  if (spasLoading || brandsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Загрузка данных...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Добро пожаловать, {profile?.name || 'Вендор'}!
          </h1>
          <p className="text-gray-600">
            Управляйте своими СПА комплексами и отслеживайте заявки
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Всего СПА</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSpas}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Активные СПА</p>
                  <p className="text-2xl font-bold text-gray-900">{activeSpas}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Всего заявок</p>
                  <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Новые заявки</p>
                  <p className="text-2xl font-bold text-gray-900">{newLeads}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Быстрые действия */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link to="/adminko/spa/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить СПА
                </Button>
              </Link>
              <Link to="/adminko/leads">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Просмотр заявок
                </Button>
              </Link>
              <Link to="/adminko/brands">
                <Button variant="outline">
                  <Building className="h-4 w-4 mr-2" />
                  Управление брендами
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Мои бренды */}
        {brands.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Мои бренды</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.map((brand) => (
                  <div key={brand.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{brand.name}</h3>
                      <Badge variant={brand.active ? "default" : "secondary"}>
                        {brand.active ? "Активен" : "Неактивен"}
                      </Badge>
                    </div>
                    {brand.description && (
                      <p className="text-sm text-gray-600 mb-2">{brand.description}</p>
                    )}
                    <Link to={`/adminko/brands`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Управлять
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Мои СПА комплексы */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Мои СПА комплексы</CardTitle>
          </CardHeader>
          <CardContent>
            {spas.length === 0 ? (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  У вас пока нет СПА комплексов
                </h3>
                <p className="text-gray-600 mb-4">
                  Создайте свой первый СПА комплекс для начала работы
                </p>
                <Link to="/adminko/spa/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить СПА
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spas.map((spa) => (
                  <div key={spa.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-lg">{spa.name}</h3>
                      <Badge variant={spa.active ? "default" : "secondary"}>
                        {spa.active ? "Активен" : "Неактивен"}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {spa.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 mr-1" />
                        {spa.rating} ({spa.reviewCount} отзывов)
                      </div>
                      <div className="text-sm text-gray-600">
                        {categoryLabels[spa.category] || spa.category}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/adminko/spa/${spa.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Редактировать
                        </Button>
                      </Link>
                      <Link to={`/spa/${spa.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Последние заявки */}
        {leads.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Последние заявки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-gray-600">{lead.phone}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={lead.status === 'new' ? 'default' : 'secondary'}>
                        {lead.status === 'new' ? 'Новая' : lead.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {leads.length > 5 && (
                <div className="mt-4 text-center">
                  <Link to="/adminko/leads">
                    <Button variant="outline">
                      Показать все заявки ({leads.length})
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
