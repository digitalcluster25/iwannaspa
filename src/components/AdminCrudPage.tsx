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
import { Plus, Edit, Trash2 } from 'lucide-react';

interface CrudItem {
  id: string;
  name: string;
  value?: string;
  active: boolean;
}

interface AdminCrudPageProps {
  title: string;
  items: CrudItem[];
  onAdd: (item: Omit<CrudItem, 'id'>) => void;
  onEdit: (id: string, item: Partial<CrudItem>) => void;
  onDelete: (id: string) => void;
  hasValue?: boolean;
}

export function AdminCrudPage({ title, items, onAdd, onEdit, onDelete, hasValue = false }: AdminCrudPageProps) {
  const [editingItem, setEditingItem] = useState<CrudItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    active: true
  });

  const handleAdd = () => {
    if (formData.name.trim()) {
      onAdd({
        name: formData.name.trim(),
        ...(hasValue && { value: formData.value.trim() }),
        active: formData.active
      });
      setFormData({ name: '', value: '', active: true });
      setIsAddDialogOpen(false);
    }
  };

  const handleEdit = () => {
    if (editingItem && formData.name.trim()) {
      onEdit(editingItem.id, {
        name: formData.name.trim(),
        ...(hasValue && { value: formData.value.trim() }),
        active: formData.active
      });
      setFormData({ name: '', value: '', active: true });
      setEditingItem(null);
      setIsEditDialogOpen(false);
    }
  };

  const openEditDialog = (item: CrudItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      value: item.value || '',
      active: item.active
    });
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    setFormData({ name: '', value: '', active: true });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl mb-2">{title}</h1>
          <p className="text-muted-foreground">
            Управление справочником данных
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
              <DialogTitle>Добавить новую запись</DialogTitle>
              <DialogDescription>
                Заполните поля ниже для создания новой записи в справочнике.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Введите название"
                />
              </div>
              {hasValue && (
                <div className="space-y-2">
                  <Label htmlFor="value">Значение *</Label>
                  <Input
                    id="value"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Введите значение"
                  />
                </div>
              )}
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
                <Button onClick={handleAdd} disabled={!formData.name.trim() || (hasValue && !formData.value.trim())}>
                  Добавить
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title} ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  {hasValue && <TableHead>Значение</TableHead>}
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                    </TableCell>
                    {hasValue && (
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {item.value}
                        </code>
                      </TableCell>
                    )}
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
                              <AlertDialogTitle>Удалить запись?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы уверены, что хотите удалить "{item.name}"? 
                                Это действие нельзя будет отменить.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => onDelete(item.id)}
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

          {items.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                Записи не найдены
              </div>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить первую запись
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать запись</DialogTitle>
            <DialogDescription>
              Измените поля ниже для обновления записи в справочнике.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Название *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Введите название"
              />
            </div>
            {hasValue && (
              <div className="space-y-2">
                <Label htmlFor="edit-value">Значение *</Label>
                <Input
                  id="edit-value"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Введите значение"
                />
              </div>
            )}
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
              <Button onClick={handleEdit} disabled={!formData.name.trim() || (hasValue && !formData.value.trim())}>
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}