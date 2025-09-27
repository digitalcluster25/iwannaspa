import { AdminCrudPage } from './AdminCrudPage'
import { useCategories } from '../hooks/useReferences'
import { categoryService } from '../services/referenceService'
import { Category } from '../types/spa'
import { toast } from 'sonner'

export function AdminCategoriesPage() {
  const { categories, loading, refetch } = useCategories()

  const handleAdd = async (newCategory: Omit<Category, 'id'>) => {
    try {
      await categoryService.create({
        name: newCategory.name,
        label: newCategory.name,
        value: newCategory.value,
        active: newCategory.active,
      })
      await refetch()
      toast.success('Категория добавлена')
    } catch (error) {
      toast.error('Ошибка добавления категории')
    }
  }

  const handleEdit = async (id: string, updates: Partial<Category>) => {
    try {
      await categoryService.update(id, updates)
      await refetch()
      toast.success('Категория обновлена')
    } catch (error) {
      toast.error('Ошибка обновления категории')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await categoryService.delete(id)
      await refetch()
      toast.success('Категория удалена')
    } catch (error) {
      toast.error('Ошибка удаления категории')
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
    <AdminCrudPage
      title="Категории"
      items={categories}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      hasValue={true}
    />
  )
}
