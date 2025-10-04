import { useState } from 'react'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Switch } from './ui/switch'
import { Plus, Edit, Trash2, Building2, User } from 'lucide-react'
import { useBrands } from '@/hooks/useBrands'
import { brandService } from '@/services/brandService'
import { database as supabase } from '@/lib/database'
import { toast } from 'sonner'
import type { Brand } from '@/types/spa'

interface VendorOption {
  id: string
  name: string | null
  email: string
}

export function AdminBrandsPage() {
  const { brands, loading, refetch } = useBrands()
  const [vendors, setVendors] = useState<VendorOption[]>([])
  const [loadingVendors, setLoadingVendors] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    active: true,
    owner_id: 'none',
  })

  // Загрузка списка вендоров для выбора владельца
  const fetchVendors = async () => {
    try {
      setLoadingVendors(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name')
        .eq('role', 'vendor')
        .order('name')

      if (error) throw error

      // Получаем email из auth.users для каждого вендора
      const vendorsWithEmails = await Promise.all(
        data.map(async (vendor) => {
          const { data: userData } = await supabase.auth.admin.getUserById(
            vendor.id
          )
          return {
            id: vendor.id,
            name: vendor.name,
            email: userData.user?.email || '',
          }
        })
      )

      setVendors(vendorsWithEmails)
    } catch (error) {
      console.error('Error fetching vendors:', error)
      toast.error('Ошибка загрузки вендоров')
    } finally {
      setLoadingVendors(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      toast.error('Укажите название бренда')
      return
    }

    try {
      await brandService.create({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        logo: formData.logo.trim() || undefined,
        active: formData.active,
        owner_id: formData.owner_id === 'none' ? undefined : formData.owner_id || undefined,
      })
      await refetch()
      toast.success('Бренд создан')
      setFormData({
        name: '',
        description: '',
        logo: '',
        active: true,
        owner_id: 'none',
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Error creating brand:', error)
      toast.error('Ошибка создания бренда')
    }
  }

  const handleEdit = async () => {
    if (!editingBrand || !formData.name.trim()) {
      toast.error('Укажите название бренда')
      return
    }

    try {
      await brandService.update(editingBrand.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        logo: formData.logo.trim() || null,
        active: formData.active,
        owner_id: formData.owner_id === 'none' ? null : formData.owner_id || null,
      })
      await refetch()
      toast.success('Бренд обновлен')
      setFormData({
        name: '',
        description: '',
        logo: '',
        active: true,
        owner_id: 'none',
      })
      setEditingBrand(null)
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Error updating brand:', error)
      toast.error('Ошибка обновления бренда')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await brandService.delete(id)
      await refetch()
      toast.success('Бренд удален')
    } catch (error) {
      console.error('Error deleting brand:', error)
      toast.error('Ошибка удаления бренда')
    }
  }

  const openEditDialog = (brand: Brand) => {
    setEditingBrand(brand)
    setFormData({
      name: brand.name,
      description: brand.description || '',
      logo: brand.logo || '',
      active: brand.active,
      owner_id: brand.owner_id || 'none',
    })
    fetchVendors()
    setIsEditDialogOpen(true)
  }

  const openAddDialog = () => {
    setFormData({
      name: '',
      description: '',
      logo: '',
      active: true,
      owner_id: 'none',
    })
    fetchVendors()
    setIsAddDialogOpen(true)
  }

  const getOwnerDisplay = (brand: Brand) => {
    if (!brand.owner_id) return 'Не назначен'
    if (brand.owner?.name) return brand.owner.name
    return 'Вендор'
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
          <h1 className="text-3xl mb-2">Бренды</h1>
          <p className="text-muted-foreground">
            Управление брендами и привязка к вендорам
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить бренд
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить новый бренд</DialogTitle>
              <DialogDescription>
                Заполните информацию о бренде и выберите владельца (вендора).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Введите название бренда"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Введите описание бренда"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">URL логотипа</Label>
                <Input
                  id="logo"
                  value={formData.logo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, logo: e.target.value }))
                  }
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner">Владелец (вендор)</Label>
                <Select
                  value={formData.owner_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, owner_id: value }))
                  }
                  disabled={loadingVendors}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите вендора" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Без владельца</SelectItem>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name || vendor.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Активен</Label>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, active: checked }))
                  }
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Отмена
                </Button>
                <Button onClick={handleAdd} disabled={!formData.name.trim()}>
                  Создать
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Бренды ({brands.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Бренд</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Владелец</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          {brand.logo ? (
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="font-medium">{brand.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground max-w-md truncate">
                        {brand.description || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {getOwnerDisplay(brand)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={brand.active ? 'default' : 'secondary'}
                      >
                        {brand.active ? 'Активен' : 'Неактивен'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(brand)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Удалить бренд?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы уверены, что хотите удалить "{brand.name}"?
                                Это действие нельзя будет отменить. Все СПА
                                комплексы этого бренда станут без владельца.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(brand.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Удалить
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {brands.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                Бренды не найдены
              </div>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить первый бренд
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать бренд</DialogTitle>
            <DialogDescription>
              Измените информацию о бренде.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Название *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Введите название бренда"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Описание</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Введите описание бренда"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-logo">URL логотипа</Label>
              <Input
                id="edit-logo"
                value={formData.logo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, logo: e.target.value }))
                }
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-owner">Владелец (вендор)</Label>
              <Select
                value={formData.owner_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, owner_id: value }))
                }
                disabled={loadingVendors}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите вендора" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Без владельца</SelectItem>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name || vendor.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-active">Активен</Label>
              <Switch
                id="edit-active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, active: checked }))
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button onClick={handleEdit} disabled={!formData.name.trim()}>
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
