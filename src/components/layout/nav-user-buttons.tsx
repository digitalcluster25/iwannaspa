import { useNavigate } from 'react-router-dom'
import { LogOut, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export function NavUserButtons() {
  const { signOut } = useAuth()
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

  return (
    <div className='space-y-2'>
      <Button
        variant='outline'
        size='sm'
        className='w-full justify-start'
        onClick={() => navigate('/profile')}
      >
        <UserIcon className='h-4 w-4 mr-2' />
        Профиль
      </Button>
      <Button
        variant='outline'
        size='sm'
        className='w-full justify-start'
        onClick={handleLogout}
      >
        <LogOut className='h-4 w-4 mr-2' />
        Выйти
      </Button>
    </div>
  )
}

