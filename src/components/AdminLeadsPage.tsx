import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Search } from 'lucide-react'
import type { Lead } from '../types/spa'
import { useLeads } from '../hooks/useLeads'

export function AdminLeadsPage() {
  // Получаем данные из Supabase
  const { leads, loading, error } = useLeads()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const statusLabels = {
    new: 'Новый',
    contacted: 'В обработке',
    confirmed: 'Подтвержден',
    cancelled: 'Отменен',
  }

  const statusColors = {
    new: 'default',
    contacted: 'default',
    confirmed: 'default',
    cancelled: 'secondary',
  } as const

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.customerPhone.includes(searchTerm) ||
      lead.spaName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDateOnly = (dateStr: string) => {
    const date = new Date(dateStr)
    const months = [
      'янв.',
      'февр.',
      'мар.',
      'апр.',
      'мая',
      'июня',
      'июля',
      'авг.',
      'сент.',
      'окт.',
      'нояб.',
      'дек.',
    ]

    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear().toString().slice(-2)

    return `${day} ${month} ${year}`
  }

  // Loading состояние
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Загрузка...</p>
        </div>
      </div>
    )
  }

  // Error состояние
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-destructive text-lg mb-4">Ошибка загрузки</p>
          <p className="text-muted-foreground mb-6">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl mb-4">Лиды</h1>
        <p className="text-muted-foreground">Управление заявками от клиентов</p>
      </div>

      {/* Фильтры */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Поиск по имени, телефону или СПА..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="new">Новые</SelectItem>
            <SelectItem value="contacted">В обработке</SelectItem>
            <SelectItem value="confirmed">Подтвержденные</SelectItem>
            <SelectItem value="cancelled">Отмененные</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Заголовки таблицы */}
      <div className="hidden lg:block mb-2">
        <div className="py-3 px-4">
          <div className="admin-table-grid text-sm text-muted-foreground">
            <div>Статус</div>
            <div>Клиент</div>
            <div>СПА комплекс</div>
            <div>Сумма</div>
            <div>Телефон</div>
            <div>Дата заявки</div>
            <div>Дата бронирования</div>
            <div></div>
          </div>
        </div>
      </div>

      {/* Список лидов */}
      <div className="space-y-1">
        {filteredLeads.map((lead, index) => (
          <div
            key={lead.id}
            className={`admin-table-row py-4 px-4 transition-colors`}
          >
            {/* Основная информация в табличном виде */}
            <div className="admin-table-grid">
              {/* Статус */}
              <div>
                <Badge
                  variant={statusColors[lead.status]}
                  className="text-xs w-32 justify-center"
                >
                  {statusLabels[lead.status]}
                </Badge>
              </div>

              {/* Имя клиента */}
              <div className="min-w-0">
                <div className="font-medium truncate text-sm">
                  {lead.customerName}
                </div>
              </div>

              {/* Название СПА */}
              <div className="min-w-0">
                <div className="text-sm text-muted-foreground truncate">
                  {lead.spaName}
                </div>
              </div>

              {/* Сумма */}
              <div className="text-sm">
                <span className="font-medium">
                  {lead.totalAmount.toLocaleString()} ₴
                </span>
              </div>

              {/* Телефон */}
              <div className="text-sm min-w-0">
                <span className="truncate">{lead.customerPhone}</span>
              </div>

              {/* Дата заявки */}
              <div className="text-sm">
                <span className="truncate">
                  {formatDateOnly(lead.createdAt)}
                </span>
              </div>

              {/* Дата бронирования */}
              <div className="text-sm">
                {lead.visitDate ? (
                  <span className="truncate">
                    {formatDateOnly(lead.visitDate)}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-xs">
                    Не указана
                  </span>
                )}
              </div>

              {/* Действия */}
              <div className="flex items-center justify-end">
                <Link to={`/admin/leads/${lead.id}`}>
                  <Button size="sm" variant="outline" className="h-8">
                    <span className="text-xs">Подробнее</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {filteredLeads.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Лиды не найдены</p>
          </div>
        )}
      </div>
    </div>
  )
}
