import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Droplets, Github, ExternalLink, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function KokonutNav() {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path)

  const navItems = [
    { label: 'Components', path: '/components' },
    { label: 'Templates', path: '/templates', badge: 'New' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Logo Section */}
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500">
              <Droplets className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">Iwanna UI</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-center">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-2 transition-colors hover:text-foreground/80 ${
                  isActive(item.path)
                    ? 'text-foreground'
                    : 'text-foreground/60'
                }`}
              >
                {item.label}
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className="px-1.5 py-0.5 text-xs bg-orange-100 text-orange-700 hover:bg-orange-100"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center justify-end space-x-2">
          {/* Explore Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden md:flex items-center gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          >
            <Sparkles className="h-4 w-4" />
            Explore 70+ new components and templates
            <ExternalLink className="h-3 w-3" />
          </Button>

          {/* Pro Button */}
          <Button 
            size="sm" 
            className="hidden md:inline-flex bg-black hover:bg-gray-800 text-white"
          >
            Iwanna UI Pro
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>

          {/* Github Button */}
          <Button variant="ghost" size="sm" className="w-9 px-0">
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </Button>

          {/* Theme Toggle Placeholder */}
          <Button variant="ghost" size="sm" className="w-9 px-0">
            <svg
              className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}