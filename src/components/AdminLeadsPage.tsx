import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search } from 'lucide-react';
import type { Lead } from '../types/spa';

// Mock данные для лидов
const mockLeads: Lead[] = [
  {
    id: '1',
    spaId: '1',
    spaName: 'Терма СПА',
    customerName: 'Анна Петрова',
    customerPhone: '+380501234567',
    customerEmail: 'anna@example.com',
    selectedServices: [
      { id: '1', name: 'Классический массаж', price: 800 },
      { id: '2', name: 'Парафинотерапия', price: 600 }
    ],
    totalAmount: 1400,
    message: 'Хочу записаться на завтра',
    status: 'new',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    visitDate: '2024-01-16T14:00:00Z'
  },
  {
    id: '2',
    spaId: '2',
    spaName: 'Aqua Relax',
    customerName: 'Олег Иванов',
    customerPhone: '+380502345678',
    selectedServices: [
      { id: '3', name: 'Гидромассаж', price: 1200 }
    ],
    totalAmount: 1200,
    status: 'contacted',
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
    visitDate: '2024-01-18T11:30:00Z'
  },
  {
    id: '3',
    spaId: '1',
    spaName: 'Терма СПА',
    customerName: 'Мария Коваленко',
    customerPhone: '+380503456789',
    customerEmail: 'maria@example.com',
    selectedServices: [
      { id: '1', name: 'Классический массаж', price: 800 },
      { id: '4', name: 'Ароматерапия', price: 500 },
      { id: '5', name: 'SPA-пакет Релакс', price: 1500 }
    ],
    totalAmount: 2800,
    message: 'Хочу подарочный сертификат',
    status: 'confirmed',
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
    visitDate: '2024-01-20T10:00:00Z'
  }
];

export function AdminLeadsPage() {
  const [leads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusLabels = {
    new: 'Новый',
    contacted: 'В обработке',
    confirmed: 'Подтвержден',
    cancelled: 'Отменен'
  };

  const statusColors = {
    new: 'default',
    contacted: 'default',
    confirmed: 'default',
    cancelled: 'secondary'
  } as const;

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.customerPhone.includes(searchTerm) ||
                         lead.spaName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = [
      'янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июня',
      'июля', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl mb-4">Лиды</h1>
        <p className="text-muted-foreground">
          Управление заявками от клиентов
        </p>
      </div>

      {/* Фильтры */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Поиск по имени, телефону или СПА..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          <div key={lead.id} className={`admin-table-row py-4 px-4 transition-colors`}>
            {/* Основная информация в табличном виде */}
            <div className="admin-table-grid">
              {/* Статус */}
              <div>
                <Badge variant={statusColors[lead.status]} className="text-xs w-32 justify-center">
                  {statusLabels[lead.status]}
                </Badge>
              </div>
              
              {/* Имя клиента */}
              <div className="min-w-0">
                <div className="font-medium truncate text-sm">{lead.customerName}</div>
              </div>
              
              {/* Название СПА */}
              <div className="min-w-0">
                <div className="text-sm text-muted-foreground truncate">{lead.spaName}</div>
              </div>
              
              {/* Сумма */}
              <div className="text-sm">
                <span className="font-medium">{lead.totalAmount.toLocaleString()} ₴</span>
              </div>
              
              {/* Телефон */}
              <div className="text-sm min-w-0">
                <span className="truncate">{lead.customerPhone}</span>
              </div>
              
              {/* Дата заявки */}
              <div className="text-sm">
                <span className="truncate">{formatDateOnly(lead.createdAt)}</span>
              </div>
              
              {/* Дата бронирования */}
              <div className="text-sm">
                {lead.visitDate ? (
                  <span className="truncate">{formatDateOnly(lead.visitDate)}</span>
                ) : (
                  <span className="text-muted-foreground text-xs">Не указана</span>
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
  );
}