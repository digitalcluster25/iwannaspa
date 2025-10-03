import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useUserLeads } from '@/hooks/useUserLeads'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, LogOut, Mail, Phone, User as UserIcon, Calendar, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

export function ProfilePage() {
  const { user, signOut, updateProfile } = useAuth()
  const navigate = useNavigate()
  const { leads, loading: leadsLoading, refresh } = useUserLeads(user?.email)

  const [isUpdating, setIsUpdating] = useState(false)
  const [name, setName] = useState(user?.user_metadata?.name || '')
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '')

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
      toast.success('Вы вышли из аккаунта')
    } catch (err: any) {
      toast.error('Ошибка при выходе: ' + err.message)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      await updateProfile({ name, phone })
      toast.success('Профиль обновлен')
    } catch (err: any) {
      toast.error('Ошибка при обновлении: ' + err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      new: 'default',
      contacted: 'secondary',
      confirmed: 'outline',
      cancelled: 'destructive',
    }

    const labels: Record<string, string> = {
      new: 'Новая',
      contacted: 'Связались',
      confirmed: 'Подтверждена',
      cancelled: 'Отменена',
    }

    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Заголовок */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Личный кабинет</h1>
          <p className="text-muted-foreground">
            {user?.email}
          </p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Выйти
        </Button>
      </div>

      {/* Вкладки */}
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="w-fit h-auto p-0 bg-transparent border-b mb-6">
          <TabsTrigger 
            value="bookings" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
          >
            Мои заявки
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
          >
            Настройки профиля
          </TabsTrigger>
        </TabsList>

        {/* Мои заявки */}
        <TabsContent value="bookings" className="space-y-4">
          {leadsLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : leads.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    У вас пока нет заявок
                  </p>
                  <Link to="/catalog">
                    <Button>Перейти в каталог</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {leads.map(lead => (
                <Card key={lead.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">
                          <Link 
                            to={`/spa/${lead.spaId}`}
                            className="hover:underline"
                          >
                            {lead.spaName}
                          </Link>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Заявка от {new Date(lead.createdAt).toLocaleDateString('ru-RU')}
                        </CardDescription>
                      </div>
                      {getStatusBadge(lead.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {lead.visitDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Дата визита: {new Date(lead.visitDate).toLocaleDateString('ru-RU')}</span>
                      </div>
                    )}

                    {lead.selectedServices.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Выбранные услуги:</p>
                        <div className="space-y-1">
                          {lead.selectedServices.map((service, idx) => (
                            <div key={idx} className="text-sm flex justify-between">
                              <span>{service.name}</span>
                              <span className="font-medium">{service.price} ₴</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {lead.message && (
                      <div>
                        <p className="text-sm font-medium mb-1">Сообщение:</p>
                        <p className="text-sm text-muted-foreground">{lead.message}</p>
                      </div>
                    )}

                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Итого:</span>
                        <span className="text-xl font-bold">{lead.totalAmount} ₴</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Настройки профиля */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Настройки профиля</CardTitle>
              <CardDescription>
                Обновите свои персональные данные
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    <UserIcon className="inline h-4 w-4 mr-2" />
                    Имя
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ваше имя"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="inline h-4 w-4 mr-2" />
                    Телефон
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+380 XX XXX XX XX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="inline h-4 w-4 mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    Email нельзя изменить
                  </p>
                </div>

                <Button type="submit" disabled={isUpdating} className="w-full">
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Сохранить изменения
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
