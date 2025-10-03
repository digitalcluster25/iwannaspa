import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { NavGroup as NavGroupProps } from './types'

export function NavGroup({ title, items, isFirst = false }: NavGroupProps & { isFirst?: boolean }) {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <div className={`mb-4 ${isFirst ? 'mt-0' : ''}`}>
      <h3 className='mb-2 px-2 text-xs font-medium text-muted-foreground'>{title}</h3>
      <div>
        {items.map((item, index) => {
          if (!item.url) return null
          
          const isActive = pathname === item.url
          const Icon = item.icon

          return (
            <div key={item.url} style={index > 0 ? { marginTop: '5px' } : {}}>
              <Link to={item.url}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className='w-full justify-start'
                  size='sm'
                >
                  {Icon && <Icon className='mr-2 h-4 w-4' />}
                  {item.title}
                  {item.badge && (
                    <Badge className='ml-auto' variant='secondary'>
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
