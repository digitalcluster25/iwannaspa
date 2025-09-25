import { useState } from 'react';
import { AdminCrudPage } from './AdminCrudPage';
import { mockCities } from '../data/mockData';
import { City } from '../types/spa';

export function AdminCitiesPage() {
  const [cities, setCities] = useState<City[]>(mockCities);

  const handleAdd = (newCity: Omit<City, 'id'>) => {
    const city: City = {
      id: Date.now().toString(),
      ...newCity
    };
    setCities(prev => [...prev, city]);
  };

  const handleEdit = (id: string, updates: Partial<City>) => {
    setCities(prev => prev.map(city => 
      city.id === id ? { ...city, ...updates } : city
    ));
  };

  const handleDelete = (id: string) => {
    setCities(prev => prev.filter(city => city.id !== id));
  };

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