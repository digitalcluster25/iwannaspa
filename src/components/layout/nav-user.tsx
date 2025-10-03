import { useNavigate } from 'react-router-dom'
import { LogOut, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

type NavUserProps = {
  user: {
    name: string
    email: string
    avatar?: string
  }
}

export function NavUser({ user: defaultUser }: NavUserProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/')
      toast.success('Вы вышли из аккаунта')
    } catch (error) {
      toast.error('Ошибка при выходе')
    }
  }

  const currentUser = user
    ? {
        name: user.user_metadata?.name || 'Admin',
        email: user.email || defaultUser.email,
      }
    : defaultUser

  return (
    <>
      <div className='p-3'>
        <div className='text-sm font-medium'>{currentUser.name}</div>
        <div className='text-xs text-muted-foreground'>{currentUser.email}</div>
      </div>
    </>
  )
}
