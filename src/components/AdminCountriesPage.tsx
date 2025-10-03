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
import { Plus, Edit, Trash2, Globe } from 'lucide-react'
import { useCountries } from '../hooks/useReferences'
import { countryService } from '../services/referenceService'
import { toast } from 'sonner'

export function AdminCountriesPage() {
  const { countries, loading, refetch } = useCountries()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await countryService.delete(id)
      await refetch()
      toast.success('Страна успешно удалена')
    } catch (error) {
      console.error('Error deleting country:', error)
      toast.error('Ошибка при удалении страны')
    } finally {
      setDeletingId(null)
    }
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl mb-2">Управление странами</h1>
          <p className="text-muted-foreground">
            Добавляйте, редактируйте и удаляйте страны
          </p>
        </div>
        <Link to="/adminko/countries/new">
          <Button size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Добавить страну
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Страны ({countries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Код</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {countries.map(country => (
                  <TableRow
                    key={country.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Globe className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{country.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {country.code}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={country.active ? 'default' : 'secondary'}
                        size="sm"
                      >
                        {country.active ? 'Активна' : 'Неактивна'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/adminko/countries/${country.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={deletingId === country.id}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Удалить страну?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы уверены, что хотите удалить "{country.name}"? Это
                                действие нельзя будет отменить.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(country.id)}
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

          {countries.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                Страны не найдены
              </div>
              <Link to="/adminko/countries/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить первую страну
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
