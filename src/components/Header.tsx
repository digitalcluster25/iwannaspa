import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Droplets, User, Settings } from 'lucide-react';

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplets className="h-8 w-8 text-primary" />
            <Link to="/" className="text-xl text-primary">
              Iwanna
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`hover:text-primary transition-colors ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Главная
            </Link>
            <Link 
              to="/catalog" 
              className={`hover:text-primary transition-colors ${
                isActive('/catalog') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Каталог
            </Link>
          </nav>

          <div className="hidden">
            {/* Moved to footer */}
          </div>
        </div>
      </div>
    </header>
  );
}