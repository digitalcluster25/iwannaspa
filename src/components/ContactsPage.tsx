import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export function ContactsPage() {
  const cities = [
    {
      name: 'Киев',
      phone: '+380 44 123 45 67',
      email: 'kiev@after.spa',
      address: 'ул. Крещатик, 10, Киев, 01001'
    },
    {
      name: 'Одесса',
      phone: '+380 48 123 45 67',
      email: 'odessa@after.spa',
      address: 'ул. Дерибасовская, 15, Одесса, 65000'
    },
    {
      name: 'Львов',
      phone: '+380 32 123 45 67',
      email: 'lviv@after.spa',
      address: 'пл. Рынок, 8, Львов, 79000'
    },
    {
      name: 'Буковель',
      phone: '+380 34 123 45 67',
      email: 'bukovel@after.spa',
      address: 'ул. Горная, 25, Буковель, 78593'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-4">Контакты</h1>
        <p className="text-muted-foreground text-lg">
          Свяжитесь с нами любым удобным способом
        </p>
      </div>

      {/* General Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Общая информация</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Горячая линия</p>
              <p>+380 800 123 456</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>info@after.spa</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Время работы</p>
              <p>Ежедневно 9:00 - 22:00</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cities */}
      <div className="grid md:grid-cols-2 gap-6">
        {cities.map((city) => (
          <Card key={city.name}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {city.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{city.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{city.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <span className="text-sm">{city.address}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}