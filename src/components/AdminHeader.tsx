import { Link, useLocation } from 'react-router-dom';
import { Droplets, Settings, Building2, MapPin, Tag, Target, Wrench, Briefcase, Users } from 'lucide-react';

export function AdminHeader() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/admin', label: 'СПА комплексы', icon: Building2 },
    { path: '/admin/leads', label: 'Лиды', icon: Users },
    { path: '/admin/cities', label: 'Города', icon: MapPin },
    { path: '/admin/categories', label: 'Категории', icon: Tag },
    { path: '/admin/purposes', label: 'Цели', icon: Target },
    { path: '/admin/amenities', label: 'Удобства', icon: Wrench },
    { path: '/admin/services', label: 'Услуги', icon: Briefcase },
  ];

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplets className="h-8 w-8 text-primary" />
            <Link to="/admin" className="text-xl text-primary">
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

          <div className="flex items-center gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Перейти на сайт
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}