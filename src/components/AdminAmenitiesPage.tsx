import { AdminCrudPage } from './AdminCrudPage';
import { useAmenities } from '../hooks/useReferences';
import { amenityService } from '../services/referenceService';
import { Amenity } from '../types/spa';
import { toast } from 'sonner';

export function AdminAmenitiesPage() {
  const { amenities, loading, refetch } = useAmenities();

  const handleAdd = async (newAmenity: Omit<Amenity, 'id'>) => {
    try {
      await amenityService.create({ name: newAmenity.name, active: newAmenity.active });
      await refetch();
      toast.success('Удобство добавлено');
    } catch (error) {
      toast.error('Ошибка добавления удобства');
    }
  };

  const handleEdit = async (id: string, updates: Partial<Amenity>) => {
    try {
      await amenityService.update(id, updates);
      await refetch();
      toast.success('Удобство обновлено');
    } catch (error) {
      toast.error('Ошибка обновления удобства');
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
    <AdminCrudPage
      title="Удобства"
      items={amenities}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      hasValue={false}
    />
  );
}
