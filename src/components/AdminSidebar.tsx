import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const isActive = (path: string) => location.pathname === path

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/')
      toast.success('Вы вышли из аккаунта')
    } catch (error) {
      toast.error('Ошибка при выходе')
    }
  }

  const navigationItems = [
    { path: '/adminko', label: 'СПА комплексы' },
    { path: '/adminko/leads', label: 'Лиды' },
    { path: '/adminko/countries', label: 'Страны' },
    { path: '/adminko/cities', label: 'Города' },
    { path: '/adminko/categories', label: 'Категории' },
    { path: '/adminko/purposes', label: 'Цели' },
    { path: '/adminko/amenities', label: 'Удобства' },
    { path: '/adminko/services', label: 'Услуги' },
  ]

  return (
    <aside className="w-48 bg-white border-r min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6">
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigationItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`
                block px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive(path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <Link
          to="/"
          className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Перейти на сайт
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Выйти
        </Button>
      </div>
    </aside>
  )
}
