import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('admin' | 'vendor' | 'user')[]
}

export function ProtectedRoute({ children, allowedRoles = ['admin'] }: ProtectedRouteProps) {
  const { user, profile, isAdmin, isVendor, isUser, loading } = useAuth()
  const location = useLocation()

  console.log('🔍 ProtectedRoute render:', {
    user: !!user,
    profile: !!profile,
    profileRole: profile?.role,
    loading,
    allowedRoles,
    pathname: location.pathname
  })

  if (loading) {
    console.log('🔍 ProtectedRoute: Loading...')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Проверяем, что пользователь авторизован
  if (!user) {
    console.log('🔍 ProtectedRoute: No user, redirecting to auth')
    return <Navigate to="/user-auth" state={{ from: location }} replace />
  }

  // Если профиль еще не загружен, показываем загрузку
  if (!profile) {
    console.log('🔍 ProtectedRoute: No profile, showing loading')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Проверяем, что у пользователя есть нужная роль
  const hasAccess = allowedRoles.includes(profile.role)
  console.log('🔍 ProtectedRoute: Access check:', {
    userRole: profile.role,
    allowedRoles,
    hasAccess,
    isActive: profile.active
  })
  
  // Если это вендор и он не активен - на страницу модерации
  if (profile.role === 'vendor' && !profile.active) {
    console.log('🔍 ProtectedRoute: Vendor not active, redirecting to pending')
    return <Navigate to="/business/pending" replace />
  }
  
  // Админ всегда имеет доступ (независимо от allowedRoles)
  if (profile.role === 'admin') {
    console.log('🔍 ProtectedRoute: Admin access granted')
    return <>{children}</>
  }
  
  if (!hasAccess) {
    console.log('🔍 ProtectedRoute: Access denied')
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Доступ запрещен</h1>
          <p className="text-muted-foreground mb-4">
            У вас нет прав для доступа к этой странице
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    )
  }

  console.log('🔍 ProtectedRoute: Access granted')
  return <>{children}</>
}
