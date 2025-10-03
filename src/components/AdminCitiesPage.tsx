import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
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
import { Switch } from './ui/switch'
import { Plus, Edit, Trash2, MapPin, Globe } from 'lucide-react'
import { useCities, useCountries } from '../hooks/useReferences'
import { cityService } from '../services/referenceService'
import { City, Country } from '../types/spa'
import { toast } from 'sonner'

export function AdminCitiesPage() {
  const { cities, loading, refetch } = useCities()
  const { countries } = useCountries()
  const [editingCity, setEditingCity] = useState<City | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    countryId: '',
    active: true,
  })

  const handleAdd = async () => {
    if (formData.name.trim() && formData.countryId) {
      try {
        await cityService.create({
          name: formData.name.trim(),
          countryId: formData.countryId,
          active: formData.active,
        })
        await refetch()
        setFormData({ name: '', countryId: '', active: true })
        setIsAddDialogOpen(false)
        toast.success('Город добавлен')
      } catch (error) {
        toast.error('Ошибка добавления города')
      }
    }
  }

  const handleEdit = async () => {
    if (editingCity && formData.name.trim() && formData.countryId) {
      try {
        await cityService.update(editingCity.id, {
          name: formData.name.trim(),
          countryId: formData.countryId,
          active: formData.active,
        })
        await refetch()
        setFormData({ name: '', countryId: '', active: true })
        setEditingCity(null)
        setIsEditDialogOpen(false)
        toast.success('Город обновлен')
      } catch (error) {
        toast.error('Ошибка обновления города')
      }
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await cityService.delete(id)
      await refetch()
      toast.success('Город удален')
    } catch (error) {
      toast.error('Ошибка удаления города')
    }
  }

  const openEditDialog = (city: City) => {
    setEditingCity(city)
    setFormData({
      name: city.name,
      countryId: city.countryId || '',
      active: city.active,
    })
    setIsEditDialogOpen(true)
  }

  const openAddDialog = () => {
    setFormData({ name: '', countryId: '', active: true })
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
          <h1 className="text-3xl mb-2">Города</h1>
          <p className="text-muted-foreground">
            Управление городами с привязкой к странам
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить город
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить новый город</DialogTitle>
              <DialogDescription>
                Заполните поля ниже для создания нового города.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">Страна *</Label>
                <Select
                  value={formData.countryId}
                  onValueChange={value =>
                    setFormData(prev => ({ ...prev, countryId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите страну" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Название города *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Введите название города"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Активен</Label>
                <Switch
                  checked={formData.active}
                  onCheckedChange={checked =>
                    setFormData(prev => ({ ...prev, active: checked }))
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Отмена
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={!formData.name.trim() || !formData.countryId}
                >
                  Добавить
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Города ({cities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Город</TableHead>
                  <TableHead>Страна</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cities.map(city => (
                  <TableRow key={city.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{city.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {city.country?.name || 'Не указана'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={city.active ? 'default' : 'secondary'}>
                        {city.active ? 'Активен' : 'Неактивен'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(city)}
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
                                Удалить город?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы уверены, что хотите удалить "{city.name}"?
                                Это действие нельзя будет отменить.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(city.id)}
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

          {cities.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                Города не найдены
              </div>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить первый город
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать город</DialogTitle>
            <DialogDescription>
              Измените поля ниже для обновления города.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-country">Страна *</Label>
              <Select
                value={formData.countryId}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, countryId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите страну" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Название города *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={e =>
                  setFormData(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder="Введите название города"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Активен</Label>
              <Switch
                checked={formData.active}
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, active: checked }))
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Отмена
              </Button>
              <Button
                onClick={handleEdit}
                disabled={!formData.name.trim() || !formData.countryId}
              >
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}