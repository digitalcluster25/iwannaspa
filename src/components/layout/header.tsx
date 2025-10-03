import { useLocation } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const routeNames: Record<string, string> = {
  '/adminko': 'СПА комплексы',
  '/adminko/leads': 'Лиды',
  '/adminko/countries': 'Страны',
  '/adminko/cities': 'Города',
  '/adminko/categories': 'Категории',
  '/adminko/purposes': 'Цели',
  '/adminko/amenities': 'Удобства',
  '/adminko/services': 'Услуги',
}

export function Header() {
  const location = useLocation()
  const pathname = location.pathname

  // Generate breadcrumbs
  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbs = pathSegments.map((_, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`
    return {
      path,
      name: routeNames[path] || pathSegments[index],
    }
  })

  return (
    <header className='sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4'>
      <div className='flex items-center gap-2'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbItem key={crumb.path}>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink href={crumb.path}>
                      {crumb.name}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
