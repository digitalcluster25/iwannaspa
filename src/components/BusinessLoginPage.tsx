import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { Building2, AlertCircle, Info } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function BusinessLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.email || !formData.password) {
      setError('Пожалуйста, заполните все поля')
      setLoading(false)
      return
    }

    try {
      // Вход в систему
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) throw signInError

      if (data.user) {
        // Проверяем профиль пользователя
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, active')
          .eq('id', data.user.id)
          .single()

        if (profileError) throw profileError

        // Проверяем что это вендор
        if (profile.role !== 'vendor') {
          await supabase.auth.signOut()
          setError('Этот аккаунт не является аккаунтом для бизнеса')
          setLoading(false)
          return
        }

        // Проверяем активность вендора
        if (!profile.active) {
          // Вендор не активен - показываем сообщение о модерации
          navigate('/business/pending')
          return
        }

        // Вендор активен - перенаправляем в админку
        navigate('/adminko')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.message?.includes('Invalid login credentials')) {
        setError('Неверный email или пароль')
      } else {
        setError(err.message || 'Ошибка входа. Попробуйте позже.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Вход для бизнеса</CardTitle>
          <CardDescription>
            Войдите в личный кабинет для управления СПА комплексами
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

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Это вход для владельцев СПА комплексов. Для клиентов используйте{' '}
                <Link to="/user-auth" className="text-primary hover:underline font-medium">
                  обычный вход
                </Link>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                disabled={loading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Нет аккаунта?{' '}
              <Link
                to="/business/register"
                className="text-primary hover:underline font-medium"
              >
                Зарегистрироваться
              </Link>
            </p>

            <div className="pt-4 border-t">
              <p className="text-sm text-center text-muted-foreground">
                <Link to="/" className="text-primary hover:underline">
                  ← Вернуться на главную
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
