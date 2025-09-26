import { AdminCrudPage } from './AdminCrudPage';
import { useServiceTemplates } from '../hooks/useReferences';
import { serviceTemplateService } from '../services/referenceService';
import { ServiceTemplate } from '../types/spa';
import { toast } from 'sonner';

export function AdminServicesPage() {
  const { services, loading, refetch } = useServiceTemplates();

  const handleAdd = async (newService: Omit<ServiceTemplate, 'id'>) => {
    try {
      await serviceTemplateService.create({ name: newService.name, active: newService.active });
      await refetch();
      toast.success('Услуга добавлена');
    } catch (error) {
      toast.error('Ошибка добавления услуги');
    }
  };

  const handleEdit = async (id: string, updates: Partial<ServiceTemplate>) => {
    try {
      await serviceTemplateService.update(id, updates);
      await refetch();
      toast.success('Услуга обновлена');
    } catch (error) {
      toast.error('Ошибка обновления услуги');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await serviceTemplateService.delete(id);
      await refetch();
      toast.success('Услуга удалена');
    } catch (error) {
      toast.error('Ошибка удаления услуги');
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
      title="Шаблоны услуг"
      items={services}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      hasValue={false}
    />
  );
}
