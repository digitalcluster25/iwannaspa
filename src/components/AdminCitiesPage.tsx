import { useState, useEffect } from 'react';
import { AdminCrudPage } from './AdminCrudPage';
// import { mockCities } from '../data/mockData'; // Закомментировано
import { useCities } from '../hooks/useReferences';
import { cityService } from '../services/referenceService';
import { City } from '../types/spa';
import { toast } from 'sonner';

export function AdminCitiesPage() {
  const { cities, loading, refetch } = useCities();

  const handleAdd = async (newCity: Omit<City, 'id'>) => {
    try {
      await cityService.create({ name: newCity.name, active: newCity.active });
      await refetch();
      toast.success('Город добавлен');
    } catch (error) {
      toast.error('Ошибка добавления города');
    }
  };

  const handleEdit = async (id: string, updates: Partial<City>) => {
    try {
      await cityService.update(id, updates);
      await refetch();
      toast.success('Город обновлен');
    } catch (error) {
      toast.error('Ошибка обновления города');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await cityService.delete(id);
      await refetch();
      toast.success('Город удален');
    } catch (error) {
      toast.error('Ошибка удаления города');
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
      title="Города"
      items={cities}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      hasValue={false}
    />
  );
}