import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Droplets, Settings, Building2, MapPin, Tag, Target, Wrench, Briefcase, Users, LogOut } from 'lucide-react';
import { Button } from './ui/button';

export function AdminHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/auth');
  };

  const navigationItems = [
    { path: '/adminko', label: 'СПА комплексы', icon: Building2 },
    { path: '/adminko/leads', label: 'Лиды', icon: Users },
    { path: '/adminko/cities', label: 'Города', icon: MapPin },
    { path: '/adminko/categories', label: 'Категории', icon: Tag },
    { path: '/adminko/purposes', label: 'Цели', icon: Target },
    { path: '/adminko/amenities', label: 'Удобства', icon: Wrench },
    { path: '/adminko/services', label: 'Услуги', icon: Briefcase },
  ];

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplets className="h-8 w-8 text-primary" />
            <Link to="/adminko" className="text-xl text-primary">
              Iwanna <span className="text-sm text-muted-foreground">Admin</span>
            </Link>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-6">
            {navigationItems.map(({ path, label, icon: Icon }) => (
              <Link 
                key={path}
                to={path} 
                className={`flex items-center gap-2 hover:text-primary transition-colors ${
                  isActive(path) ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Перейти на сайт
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}