import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Droplets } from 'lucide-react'
import { Link } from 'react-router-dom'

export function UserAuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signUp } = useAuth()

  const from = location.state?.from?.pathname || '/profile'

  // Форма входа
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Форма регистрации
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupName, setSignupName] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await signIn(loginEmail, loginPassword)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Ошибка при входе')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await signUp(signupEmail, signupPassword, signupName)
      setSuccess('Регистрация успешна! Проверьте email для подтверждения.')
      // Очищаем форму
      setSignupEmail('')
      setSignupPassword('')
      setSignupName('')
    } catch (err: any) {
      setError(err.message || 'Ошибка при регистрации')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Простое меню */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <Droplets className="h-6 w-6" />
            <span className="font-semibold text-xl">Iwanna</span>
          </Link>
        </div>
      </div>

      {/* Форма - центрированная с ограниченной шириной */}
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-[400px]">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full justify-start border-b bg-transparent h-auto p-0 mb-6">
              <TabsTrigger 
                value="login" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
              >
                Вход
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
              >
                Регистрация
              </TabsTrigger>
            </TabsList>

            {/* Вход */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Вход в личный кабинет</CardTitle>
                  <CardDescription>
                    Войдите, чтобы просмотреть свои заявки
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Пароль</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Войти
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Регистрация */}
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Создать аккаунт</CardTitle>
                  <CardDescription>
                    Зарегистрируйтесь, чтобы отслеживать заявки
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Имя</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Ваше имя"
                        value={signupName}
                        onChange={e => setSignupName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signupEmail}
                        onChange={e => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Пароль</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Минимум 6 символов"
                        value={signupPassword}
                        onChange={e => setSignupPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert>
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Зарегистрироваться
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
