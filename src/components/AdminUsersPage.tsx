import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Switch } from './ui/switch'
import { Plus, Edit, Trash2, User, Building, Shield } from 'lucide-react'
import { database as supabase } from '@/lib/database'
import { toast } from 'sonner'

interface UserProfile {
  id: string
  name: string | null
  phone: string | null
  role: 'admin' | 'vendor' | 'user'
  active: boolean // Добавлено поле active
  created_at: string
  updated_at: string
  brands?: any[] // Бренды вендора
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [isFetchingUsers, setIsFetchingUsers] = useState(false) // Добавляем флаг защиты
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'user' as 'admin' | 'vendor' | 'user',
    active: true, // Добавлено поле active
  })

  const roleLabels = {
    admin: 'Администратор',
    vendor: 'Вендор',
    user: 'Пользователь',
  }

  const roleIcons = {
    admin: Shield,
    vendor: Building,
    user: User,
  }

  const fetchUsers = async () => {
    // Защита от повторных запросов
    if (isFetchingUsers) {
      console.log('⚠️ AdminUsersPage: Already fetching, skipping...')
      return
    }
    
    try {
      setIsFetchingUsers(true)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100) // Ограничиваем 100 пользователями

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('❌ AdminUsersPage: Error:', error)
      toast.error('Ошибка загрузки пользователей')
    } finally {
      setIsFetchingUsers(false)
    }
  }

  // Убираем fetchSpas - он больше не нужен

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        await fetchUsers()
      } catch (error) {
        console.error('❌ AdminUsersPage: Error:', error)
        toast.error('Ошибка загрузки данных')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleAddUser = async () => {
    try {
      // Создаем пользователя в auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: `${formData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        password: 'temp123456',
        email_confirm: true,
        user_metadata: {
          name: formData.name,
        },
      })

      if (authError) throw authError

      // Создаем профиль
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: formData.name,
          phone: formData.phone || null,
          role: formData.role,
          active: formData.active, // Добавлено поле active
        })

      if (profileError) throw profileError

      await fetchUsers()
      setFormData({ name: '', phone: '', role: 'user', active: true })
      setIsAddDialogOpen(false)
      toast.success('Пользователь создан')
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Ошибка создания пользователя')
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone || null,
          role: formData.role,
          active: formData.active, // Добавлено поле active
        })
        .eq('id', editingUser.id)

      if (error) throw error

      await fetchUsers()
      setEditingUser(null)
      setFormData({ name: '', phone: '', role: 'user', active: true })
      setIsEditDialogOpen(false)
      toast.success('Пользователь обновлен')
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Ошибка обновления пользователя')
    }
  }

  const openEditDialog = (user: UserProfile) => {
    setEditingUser(user)
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      role: user.role,
      active: user.active, // Добавлено поле active
    })
    setIsEditDialogOpen(true)
  }

  const openAddDialog = () => {
    setFormData({ name: '', phone: '', role: 'user', active: true })
    setIsAddDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl mb-2">Пользователи</h1>
          <p className="text-muted-foreground">
            Управление пользователями системы
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить пользователя
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить нового пользователя</DialogTitle>
              <DialogDescription>
                Заполните поля ниже для создания нового пользователя.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Введите имя"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Введите телефон"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Роль *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: 'admin' | 'vendor' | 'user') =>
                    setFormData(prev => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Пользователь</SelectItem>
                    <SelectItem value="vendor">Вендор</SelectItem>
                    <SelectItem value="admin">Администратор</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.role === 'vendor' && (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="active">Активировать вендора</Label>
                    <p className="text-sm text-muted-foreground">
                      После активации вендор получит доступ к админке
                    </p>
                  </div>
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, active: checked }))
                    }
                  />
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleAddUser} disabled={!formData.name}>
                  Создать
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Пользователи ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Имя</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата создания</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => {
                  const RoleIcon = roleIcons[user.role]
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <RoleIcon className="h-4 w-4" />
                          </div>
                          <div className="font-medium">{user.name || 'Без имени'}</div>
                        </div>
                      </TableCell>
                      <TableCell>{user.phone || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : user.role === 'vendor' ? 'secondary' : 'outline'}>
                          {roleLabels[user.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === 'vendor'
                              ? user.active
                                ? 'default'
                                : 'secondary'
                              : 'default'
                          }
                        >
                          {user.role === 'vendor'
                            ? user.active
                              ? 'Активен'
                              : 'На модерации'
                            : 'Активен'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString('ru-RU')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(user)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                Пользователи не найдены
              </div>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить первого пользователя
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать пользователя</DialogTitle>
            <DialogDescription>
              Измените данные пользователя.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Имя *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Введите имя"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Телефон</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Введите телефон"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Роль *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'admin' | 'vendor' | 'user') =>
                  setFormData(prev => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Пользователь</SelectItem>
                  <SelectItem value="vendor">Вендор</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.role === 'vendor' && (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="edit-active">Активировать вендора</Label>
                  <p className="text-sm text-muted-foreground">
                    После активации вендор получит доступ к админке
                  </p>
                </div>
                <Switch
                  id="edit-active"
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, active: checked }))
                  }
                />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleUpdateUser} disabled={!formData.name}>
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
