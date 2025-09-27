import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoginForm } from './login-form';

export function AuthPage() {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/adminko';

  // Проверяем, авторизован ли пользователь
  if (localStorage.getItem('isAuthenticated') === 'true') {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-[192px]">
        <LoginForm />
      </div>
    </div>
  );
}
