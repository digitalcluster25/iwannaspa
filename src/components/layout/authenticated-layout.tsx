import { AppSidebar } from '@/components/layout/app-sidebar'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <div className='flex min-h-screen'>
      <AppSidebar />
      <main className='flex-1 overflow-y-auto p-4 md:p-6 lg:p-8'>
        {children}
      </main>
    </div>
  )
}
