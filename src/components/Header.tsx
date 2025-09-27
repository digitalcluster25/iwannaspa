import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplets } from 'lucide-react';

export function Header() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Droplets className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Iwanna</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              Главная
            </Link>
            <Link
              to="/catalog/"
              className={`text-sm font-medium transition-colors ${
                isActive('/catalog') || isActive('/catalog/') ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              СПА комплексы
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
