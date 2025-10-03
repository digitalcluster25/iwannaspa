import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { Clock, CheckCircle2, Mail, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export function BusinessPendingPage() {
  const { user, profile, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Если пользователь не авторизован - на страницу входа
    if (!loading && !user) {
      navigate('/business/login')
      return
    }

    // Если профиль загружен и вендор активен - в админку
    if (!loading && profile) {
      if (profile.role === 'vendor' && profile.active) {
        navigate('/adminko')
      } else if (profile.role !== 'vendor') {
        navigate('/')
      }
    }
  }, [user, profile, loading, navigate])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate('/business/login')
      toast.success('Вы вышли из аккаунта')
    } catch (error) {
      toast.error('Ошибка при выходе')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">Аккаунт на модерации</CardTitle>
          <CardDescription className="text-base">
            Ваш аккаунт ожидает активации администратором
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Обычно модерация занимает до 24 часов. После активации вы получите
              доступ к личному кабинету и сможете управлять своими СПА
              комплексами.
            </AlertDescription>
          </Alert>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium">Что происходит дальше:</p>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Администратор проверит вашу регистрацию
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Вам будет привязан бренд для управления
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Вы получите доступ к админ-панели
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              По всем вопросам пишите на{' '}
              <a
                href="mailto:support@iwanna.com"
                className="text-primary hover:underline"
              >
                support@iwanna.com
              </a>
            </p>
          </div>

          <div className="pt-4 border-t space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Выйти из аккаунта
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link to="/">Вернуться на главную</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
