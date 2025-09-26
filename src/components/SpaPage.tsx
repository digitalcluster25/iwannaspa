import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

import { MapPin, Phone, Mail, ArrowLeft, Plus, Minus, Calendar, X } from 'lucide-react';
// import { mockSpas } from '../data/mockData'; // Закомментировано - теперь используем Supabase
import { useSpa } from '../hooks/useSpas';
import { useLeadActions } from '../hooks/useLeads';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SpaService } from '../types/spa';
import { toast } from 'sonner';

interface SelectedService extends SpaService {
  quantity: number;
}

export function SpaPage() {
  const { id } = useParams();
  
  // Получаем данные из Supabase
  const { spa, loading, error } = useSpa(id);
  const { createLead, loading: creatingLead } = useLeadActions();
  
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [visitDate, setVisitDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Формат YYYY-MM-DD
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerMessage, setCustomerMessage] = useState('');

  // Loading состояние
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Error состояние
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-destructive text-lg mb-4">Ошибка загрузки</p>
          <p className="text-muted-foreground mb-6">{error.message}</p>
          <Link to="/catalog">
            <Button>Вернуться к каталогу</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!spa) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl mb-4">СПА комплекс не найден</h1>
          <Link to="/catalog">
            <Button>Вернуться к каталогу</Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabels = {
    wellness: 'Wellness',
    thermal: 'Термальный',
    medical: 'Медицинский',
    beauty: 'Beauty'
  };

  // Get spa services from data
  const spaServices = spa.services || [];

  const addService = (service: SpaService) => {
    setSelectedServices(prev => {
      const existing = prev.find(s => s.id === service.id);
      if (existing) {
        return prev.map(s => 
          s.id === service.id 
            ? { ...s, quantity: s.quantity + 1 }
            : s
        );
      }
      return [...prev, { ...service, quantity: 1 }];
    });
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(prev => {
      const existing = prev.find(s => s.id === serviceId);
      if (existing && existing.quantity > 1) {
        return prev.map(s => 
          s.id === serviceId 
            ? { ...s, quantity: s.quantity - 1 }
            : s
        );
      }
      return prev.filter(s => s.id !== serviceId);
    });
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + (service.price * service.quantity), 0);
  };

  const handleCallbackRequest = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error('Укажите имя и телефон');
      return;
    }

    if (!spa) return;

    try {
      await createLead({
        spaId: spa.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: undefined,
        selectedServices: selectedServices.map(s => ({
          id: s.id,
          name: s.name,
          price: s.price
        })),
        totalAmount: getTotalPrice(),
        message: customerMessage.trim() || undefined,
        status: 'new',
        visitDate: visitDate
      });

      setIsFormSubmitted(true);
      toast.success('Заявка отправлена!');
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error('Ошибка отправки заявки');
    }
  };

  const resetForm = () => {
    setIsFormSubmitted(false);
    setSelectedServices([]);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerMessage('');
    setVisitDate(() => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <Link to="/catalog" className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Назад к каталогу
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images - без миниатюр */}
          <div className="w-full">
            <ImageWithFallback
              src={spa.images[0]}
              alt={spa.name}
              className="w-full h-64 md:h-80 object-cover rounded-lg"
            />
          </div>

          {/* Header */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{categoryLabels[spa.category]}</Badge>
                {spa.featured && <Badge>Рекомендуем</Badge>}
              </div>
              <h1 className="text-3xl mb-2">{spa.name}</h1>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {spa.location}
              </div>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl mb-4">Описание</h2>
              <p className="text-muted-foreground leading-relaxed">{spa.description}</p>
            </CardContent>
          </Card>

          {/* Spa Services */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl mb-6">СПА процедуры</h2>
              <div className="space-y-4">
                {spaServices.map((service) => (
                  <div key={service.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <ImageWithFallback
                      src={service.image}
                      alt={service.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{service.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                      <div className="text-lg font-medium">{service.price.toLocaleString()} ₴</div>
                    </div>
                    <Button onClick={() => addService(service)} size="sm">
                      Приобрести
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl mb-4">Удобства</h2>
              <Accordion type="multiple" className="w-full">
                {spa.amenities.map((amenity, index) => (
                  <AccordionItem key={index} value={`amenity-${index}`}>
                    <AccordionTrigger className="text-left">
                      {amenity}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">
                        Подробная информация об услуге "{amenity}" - профессиональное обслуживание с использованием качественного оборудования.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Card */}
          <Card className="sticky top-6">
            <CardContent className="p-6">
              {isFormSubmitted ? (
                /* Success Message */
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg text-left mb-4">Заявка отправлена!</h3>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 mb-2">
                          Спасибо за ваш запрос! Наш менеджер свяжется с вами в ближайшее время.
                        </p>
                        <p className="text-green-700 text-sm">
                          Обычно мы отвечаем в течение 15 минут в рабочее время.
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-4 h-8 w-8 p-0 flex-shrink-0"
                      onClick={resetForm}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg text-left">Связаться с менеджером</h3>
                  
                  {/* Selected Services */}
                  {selectedServices.length > 0 && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Выбранные услуги:</h4>
                      <div className="space-y-3">
                        {selectedServices.map((service) => (
                          <div key={service.id} className="text-sm">
                            <div className="text-left">{service.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-6 w-6 p-0"
                                onClick={() => removeService(service.id)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="min-w-[20px] text-center">{service.quantity}</span>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-6 w-6 p-0"
                                onClick={() => addService(service)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <span className="font-medium ml-2">
                                {(service.price * service.quantity).toLocaleString()} ₴
                              </span>
                            </div>
                          </div>
                        ))}
                        <div className="border-t pt-2 mt-3">
                          <div className="flex justify-between font-medium">
                            <span>Общая стоимость:</span>
                            <span>{getTotalPrice().toLocaleString()} ₴</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="client-name" className="block text-sm mb-1">
                        Ваше имя
                      </label>
                      <Input
                        id="client-name"
                        placeholder="Введите ваше имя"
                        className="w-full"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="client-phone" className="block text-sm mb-1">
                        Номер телефона
                      </label>
                      <Input
                        id="client-phone"
                        type="tel"
                        placeholder="+380 XX XXX XX XX"
                        className="w-full"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                      />
                    </div>

                    {/* Поля даты и сообщения отображаются только при наличии выбранных услуг */}
                    {selectedServices.length > 0 && (
                      <>
                        <div>
                          <label htmlFor="visit-date" className="block text-sm mb-1">
                            Желаемая дата посещения
                          </label>
                          <Input
                            id="visit-date"
                            type="date"
                            value={visitDate}
                            onChange={(e) => setVisitDate(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="client-message" className="block text-sm mb-1">
                            Сообщение (необязательно)
                          </label>
                          <Textarea
                            id="client-message"
                            placeholder="Дополнительная информация или пожелания..."
                            rows={3}
                            className="w-full"
                            value={customerMessage}
                            onChange={(e) => setCustomerMessage(e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Button className="w-full" size="sm" onClick={handleCallbackRequest} disabled={creatingLead}>
                      <Phone className="h-4 w-4 mr-2" />
                      {creatingLead ? 'Отправка...' : 'Перезвоните мне'}
                    </Button>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>

          {/* Location Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg mb-4">Расположение</h3>
              <div className="bg-muted h-32 rounded-lg flex items-center justify-center text-muted-foreground mb-4">
                Карта ({spa.location})
              </div>
              <p className="text-sm text-muted-foreground">
                Центральное расположение в {spa.location} с удобной транспортной доступностью
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}