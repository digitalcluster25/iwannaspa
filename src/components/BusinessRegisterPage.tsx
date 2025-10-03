import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { Building2, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function BusinessRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Валидация
    if (!formData.name || !formData.email || !formData.password) {
      setError('Пожалуйста, заполните все обязательные поля')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      setLoading(false)
      return
    }

    try {
      // Регистрация без подтверждения email
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: undefined, // Убираем email подтверждение
          data: {
            name: formData.name,
          },
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        // Проверяем, не создан ли уже профиль (на случай повторной попытки)
        const { data: checkProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single()

        if (!checkProfile) {
          // Создаем профиль вендора (неактивного)
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              name: formData.name,
              phone: formData.phone || null,
              role: 'vendor',
              active: false, // Вендор неактивен до модерации
            })

          if (profileError) {
            console.error('Profile creation error:', profileError)
            throw profileError
          }
        }

        // Показываем успешное сообщение
        setSuccess(true)
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      if (err.message?.includes('already registered') || err.message?.includes('User already registered')) {
        setError('Этот email уже зарегистрирован. Попробуйте войти.')
      } else if (err.message?.includes('duplicate key')) {
        setError('Этот аккаунт уже существует. Попробуйте войти.')
      } else {
        setError(err.message || 'Ошибка регистрации. Попробуйте позже.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Регистрация успешна!</CardTitle>
            <CardDescription className="text-base">
              Ваш аккаунт создан и ожидает модерации
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                После активации вашего аккаунта администратором, вы получите
                доступ к личному кабинету. Обычно модерация занимает до 24
                часов.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Вы можете попробовать войти в систему используя свой email и
                пароль:
              </p>
              <Button asChild className="w-full">
                <Link to="/business/login">Перейти ко входу</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Регистрация для бизнеса</CardTitle>
          <CardDescription>
            Создайте аккаунт для управления вашими СПА комплексами
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">
                Имя или название компании *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Введите ваше имя"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (___) ___-____"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Минимум 6 символов"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Повторите пароль *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                disabled={loading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Уже есть аккаунт?{' '}
              <Link
                to="/business/login"
                className="text-primary hover:underline font-medium"
              >
                Войти
              </Link>
            </p>

            <p className="text-xs text-center text-muted-foreground pt-2">
              Нажимая "Зарегистрироваться", вы принимаете{' '}
              <Link to="/offer" className="text-primary hover:underline">
                публичную оферту
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
