import { Link } from 'react-router-dom'
import { Droplets } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Droplets className="h-6 w-6 text-primary" />
            <Link to="/" className="text-lg text-primary">
              Iwanna
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="flex items-center space-x-6">
              <Link
                to="/business"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Для бизнеса
              </Link>
              <Link
                to="/contacts"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Контакты
              </Link>
              <Link
                to="/offer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Публичная оферта
              </Link>
            </div>
          </nav>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground text-center lg:text-right">
            © 2024 Iwanna. Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  )
}
