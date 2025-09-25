import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { ArrowLeft } from 'lucide-react';
import type { Lead } from '../types/spa';

// Mock данные для лида (в реальном приложении будет загружаться по ID)
const mockLead: Lead = {
  id: '1',
  spaId: '1',
  spaName: 'Терма СПА',
  customerName: 'Анна Петрова',
  customerPhone: '+380501234567',
  customerEmail: 'anna@example.com',
  selectedServices: [
    { id: '1', name: 'Классический массаж', price: 800 },
    { id: '2', name: 'Парафинотерапия', price: 600 },
    { id: '3', name: 'Ароматерапия', price: 500 }
  ],
  totalAmount: 1900,
  message: 'Хочу записаться на завтра после 14:00. Есть ли свободное время?',
  status: 'new',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  visitDate: '2024-01-20T14:00:00Z'
};

export function AdminLeadDetails() {
  const { id } = useParams();
  const [lead, setLead] = useState<Lead>(mockLead);
  const [notes, setNotes] = useState('');

  const statusLabels = {
    new: 'Новый',
    contacted: 'В обработке',
    confirmed: 'Подтвержден',
    cancelled: 'Отменен'
  };

  const statusColors = {
    new: 'outline',
    contacted: 'default',
    confirmed: 'default',
    cancelled: 'secondary'
  } as const;

  const handleStatusChange = (newStatus: string) => {
    setLead(prev => ({
      ...prev,
      status: newStatus as Lead['status'],
      updatedAt: new Date().toISOString()
    }));
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
      {/* Навигация */}
      <div className="mb-6">
        <Link to="/admin/leads" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Назад к списку лидов
        </Link>
        <h1 className="text-2xl mt-2">Лид #{lead.id}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="lg:col-span-2 space-y-6">
          {/* Информация о клиенте */}
          <div className="space-y-4">
            <h3 className="font-bold">Информация о клиенте</h3>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Имя:</span>
                <span>{lead.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Телефон:</span>
                <a href={`tel:${lead.customerPhone}`} className="text-primary hover:underline">
                  {lead.customerPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Заявка */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Заявка</h3>
              <Badge variant={statusColors[lead.status]}>
                {statusLabels[lead.status]}
              </Badge>
            </div>
            
            {/* Информация о заявке */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">СПА комплекс:</span>
                <span>{lead.spaName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Дата создания:</span>
                <span>{formatDateOnly(lead.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Дата бронирования:</span>
                <span>{lead.visitDate ? formatDateOnly(lead.visitDate) : 'Не указана'}</span>
              </div>
            </div>

            <Separator />

            {/* Выбранные услуги */}
            <div className="space-y-3">
              <h4 className="font-medium">Выбранные услуги</h4>
              {lead.selectedServices.map((service, index) => (
                <div key={service.id}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p>{service.name}</p>
                    </div>
                    <p>{service.price.toLocaleString()} ₴</p>
                  </div>
                  {index < lead.selectedServices.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
              <Separator />
              <div className="flex justify-between items-center pt-2">
                <p>Общая сумма:</p>
                <p className="text-lg">{lead.totalAmount.toLocaleString()} ₴</p>
              </div>
            </div>
          </div>

          {/* Сообщение клиента */}
          {lead.message && (
            <div className="space-y-3">
              <h3 className="font-bold">Сообщение от клиента</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p>{lead.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Боковая панель */}
        <div className="space-y-6">
          {/* Управление статусом */}
          <Card>
            <CardHeader>
              <CardTitle>Управление</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Статус заявки</label>
                <Select value={lead.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Новый</SelectItem>
                    <SelectItem value="contacted">В обработке</SelectItem>
                    <SelectItem value="confirmed">Подтвержден</SelectItem>
                    <SelectItem value="cancelled">Отменен</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground block mb-2">Способ связи <span className="font-bold">перезвонить</span></label>
                <div className="space-y-2">
                  <Button className="w-full" size="sm">
                    Перезвонить {lead.customerPhone}
                  </Button>
                  <Button className="w-full" size="sm" variant="outline">
                    WhatsApp @annapetrenko
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Заметки */}
          <Card>
            <CardHeader>
              <CardTitle>Заметки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Добавьте заметки по этому лиду..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
              <Button size="sm" className="w-full">
                Сохранить заметки
              </Button>
            </CardContent>
          </Card>

          {/* Быстрые действия */}
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to={`/spa/${lead.spaId}`} target="_blank">
                <Button variant="outline" size="sm" className="w-full">
                  Перейти к СПА
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}