import { useState } from 'react';
import { AdminCrudPage } from './AdminCrudPage';
import { mockAmenities } from '../data/mockData';
import { Amenity } from '../types/spa';

export function AdminAmenitiesPage() {
  const [amenities, setAmenities] = useState<Amenity[]>(mockAmenities);

  const handleAdd = (newAmenity: Omit<Amenity, 'id'>) => {
    const amenity: Amenity = {
      id: Date.now().toString(),
      ...newAmenity
    };
    setAmenities(prev => [...prev, amenity]);
  };

  const handleEdit = (id: string, updates: Partial<Amenity>) => {
    setAmenities(prev => prev.map(amenity => 
      amenity.id === id ? { ...amenity, ...updates } : amenity
    ));
  };

  const handleDelete = (id: string) => {
    setAmenities(prev => prev.filter(amenity => amenity.id !== id));
  };

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