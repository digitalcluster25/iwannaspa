import { AdminCrudPage } from './AdminCrudPage'
import { usePurposes } from '../hooks/useReferences'
import { purposeService } from '../services/referenceService'
import { Purpose } from '../types/spa'
import { toast } from 'sonner'

export function AdminPurposesPage() {
  const { purposes, loading, refetch } = usePurposes()

  const handleAdd = async (newPurpose: Omit<Purpose, 'id'>) => {
    try {
      await purposeService.create({
        name: newPurpose.name,
        label: newPurpose.name,
        value: newPurpose.value,
        active: newPurpose.active,
      })
      await refetch()
      toast.success('Назначение добавлено')
    } catch (error) {
      toast.error('Ошибка добавления назначения')
    }
  }

  const handleEdit = async (id: string, updates: Partial<Purpose>) => {
    try {
      await purposeService.update(id, updates)
      await refetch()
      toast.success('Назначение обновлено')
    } catch (error) {
      toast.error('Ошибка обновления назначения')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await purposeService.delete(id)
      await refetch()
      toast.success('Назначение удалено')
    } catch (error) {
      toast.error('Ошибка удаления назначения')
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
      title="Назначения"
      items={purposes}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      hasValue={true}
    />
  )
}
