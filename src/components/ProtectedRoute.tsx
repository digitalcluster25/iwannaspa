import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (!isAuthenticated) {
    // Сохраняем текущий путь для редиректа после авторизации
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return <>{children}</>
}
