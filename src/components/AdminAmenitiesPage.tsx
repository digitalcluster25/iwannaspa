import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAmenities } from '../hooks/useReferences';
import { amenityService } from '../services/referenceService';
import { Amenity } from '../types/spa';
import { toast } from 'sonner';

export function AdminAmenitiesPage() {
  const { amenities, loading, refetch } = useAmenities();
  const [editingItem, setEditingItem] = useState<Amenity | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    active: true
  });

  const handleAdd = async () => {
    if (formData.name.trim()) {
      try {
        await amenityService.create({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          active: formData.active
        });
        await refetch();
        toast.success('Удобство добавлено');
        setFormData({ name: '', description: '', active: true });
        setIsAddDialogOpen(false);
      } catch (error) {
        toast.error('Ошибка добавления удобства');
      }
    }
  };

  const handleEdit = async () => {
    if (editingItem && formData.name.trim()) {
      try {
        await amenityService.update(editingItem.id, {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          active: formData.active
        });
        await refetch();
        toast.success('Удобство обновлено');
        setFormData({ name: '', description: '', active: true });
        setEditingItem(null);
        setIsEditDialogOpen(false);
      } catch (error) {
        toast.error('Ошибка обновления удобства');
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await amenityService.delete(id);
      await refetch();
      toast.success('Удобство удалено');
    } catch (error) {
      toast.error('Ошибка удаления удобства');
    }
  };

  const openEditDialog = (item: Amenity) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      active: item.active
    });
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    setFormData({ name: '', description: '', active: true });
    setIsAddDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl mb-2">Удобства</h1>
          <p className="text-muted-foreground">
            Управление удобствами СПА комплексов
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить удобство</DialogTitle>
              <DialogDescription>
                Заполните поля ниже для создания нового удобства.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Введите название удобства"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Введите описание удобства (опционально)"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Активен</Label>
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleAdd} disabled={!formData.name.trim()}>
                  Добавить
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Удобства ({amenities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {amenities.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground max-w-md truncate">
                        {item.description || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.active ? "default" : "secondary"}>
                        {item.active ? "Активен" : "Неактивен"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
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
                              <AlertDialogTitle>Удалить удобство?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы уверены, что хотите удалить "{item.name}"? 
                                Это действие нельзя будет отменить.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(item.id)}
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

          {amenities.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                Удобства не найдены
              </div>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить первое удобство
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать удобство</DialogTitle>
            <DialogDescription>
              Измените поля ниже для обновления удобства.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Название *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Введите название удобства"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Описание</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Введите описание удобства (опционально)"
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Активен</Label>
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
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
  );
}
