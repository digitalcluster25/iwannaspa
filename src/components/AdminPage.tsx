import { useState } from 'react'
import { Link } from 'react-router-dom'
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
import { Plus, Edit, Trash2, Star, MapPin } from 'lucide-react'
// import { mockSpas } from '../data/mockData'; // Закомментировано - теперь используем Supabase
import { useSpas, useSpaActions } from '../hooks/useSpas'
import { toast } from 'sonner'

export function AdminPage() {
  // Получаем данные из Supabase
  const { spas, loading, error, refetch } = useSpas()
  const { deleteSpa, loading: deleteLoading } = useSpaActions()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const categoryLabels = {
    wellness: 'Wellness',
    thermal: 'Термальный',
    medical: 'Медицинский',
    beauty: 'Beauty',
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await deleteSpa(id)
      await refetch()
      toast.success('СПА успешно удален')
    } catch (error) {
      console.error('Error deleting spa:', error)
      toast.error('Ошибка при удалении СПА')
    } finally {
      setDeletingId(null)
    }
  }

  // Loading состояние
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Загрузка...</p>
        </div>
      </div>
    )
  }

  // Error состояние
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-destructive text-lg mb-4">Ошибка загрузки</p>
          <p className="text-muted-foreground mb-6">{error.message}</p>
          <Button onClick={() => refetch()}>Попробовать снова</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">СПА комплексы</h1>
          <p className="text-sm text-muted-foreground">
            Управляйте СПА комплексами
          </p>
        </div>
        <Link to="/adminko/spa/new">
          <Button size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Добавить СПА
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>СПА комплексы ({spas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Город</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {spas.map(spa => (
                  <TableRow
                    key={spa.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>
                      <Link
                        to={`/adminko/spa/${spa.id}/edit`}
                        className="hover:underline"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">
                              IMG
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{spa.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {spa.description}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {categoryLabels[spa.category]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {spa.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {spa.featured && <Badge size="sm">Рекомендуем</Badge>}
                        <Badge
                          variant={spa.active ? 'default' : 'secondary'}
                          size="sm"
                        >
                          {spa.active ? 'Активен' : 'Неактивен'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/adminko/spa/${spa.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={deletingId === spa.id}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Удалить СПА комплекс?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы уверены, что хотите удалить "{spa.name}"? Это
                                действие нельзя будет отменить.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(spa.id)}
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

          {spas.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                СПА комплексы не найдены
              </div>
              <Link to="/adminko/spa/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить первый СПА
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
