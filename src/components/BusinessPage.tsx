import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import {
  Building2,
  Users,
  BarChart3,
  Bell,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

export function BusinessPage() {
  const features = [
    {
      icon: Building2,
      title: 'Управление брендом',
      description:
        'Создавайте и управляйте своими СПА комплексами в одном месте',
    },
    {
      icon: Users,
      title: 'База клиентов',
      description:
        'Получайте заявки от заинтересованных клиентов прямо в личном кабинете',
    },
    {
      icon: BarChart3,
      title: 'Аналитика',
      description: 'Отслеживайте статистику просмотров и конверсию заявок',
    },
    {
      icon: Bell,
      title: 'Уведомления',
      description:
        'Получайте моментальные уведомления о новых заявках от клиентов',
    },
  ]

  const benefits = [
    'Бесплатное размещение СПА комплексов',
    'Доступ к широкой аудитории клиентов',
    'Удобный интерфейс для управления',
    'Поддержка нескольких локаций',
    'Детальная статистика и отчеты',
    'Быстрая модерация в течение 24 часов',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Развивайте свой
            <span className="text-primary block mt-2">
              СПА бизнес с Iwanna
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Платформа для владельцев СПА комплексов. Привлекайте новых клиентов
            и управляйте заявками в одном месте.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild>
              <Link to="/business/register">
                Зарегистрироваться
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/business/login">Войти</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Что мы предлагаем
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-2 hover:border-primary transition-colors">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Преимущества платформы
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Готовы начать?
          </h2>
          <p className="text-xl text-muted-foreground">
            Зарегистрируйтесь сейчас и после модерации получите доступ к
            личному кабинету
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild>
              <Link to="/business/register">
                Создать аккаунт
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground pt-4">
            Уже есть аккаунт?{' '}
            <Link
              to="/business/login"
              className="text-primary hover:underline font-medium"
            >
              Войти
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
