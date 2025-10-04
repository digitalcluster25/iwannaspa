import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface VendorRouteProps {
  children: React.ReactNode
}

export function VendorRoute({ children }: VendorRouteProps) {
  const { user, profile, isVendor, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Проверяем, что пользователь авторизован
  if (!user || !profile) {
    return <Navigate to="/user-auth" state={{ from: location }} replace />
  }

  // Проверяем, что пользователь - вендор
  if (!isVendor) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Доступ запрещен</h1>
          <p className="text-muted-foreground mb-4">
            У вас нет прав вендора для доступа к этой странице
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    )
  }

  return <>{children}</>
}

