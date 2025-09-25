import { useState } from 'react';
import { AdminCrudPage } from './AdminCrudPage';
import { mockPurposes } from '../data/mockData';
import { Purpose } from '../types/spa';

export function AdminPurposesPage() {
  const [purposes, setPurposes] = useState<Purpose[]>(mockPurposes);

  const handleAdd = (newPurpose: Omit<Purpose, 'id'>) => {
    const purpose: Purpose = {
      id: Date.now().toString(),
      ...newPurpose
    };
    setPurposes(prev => [...prev, purpose]);
  };

  const handleEdit = (id: string, updates: Partial<Purpose>) => {
    setPurposes(prev => prev.map(purpose => 
      purpose.id === id ? { ...purpose, ...updates } : purpose
    ));
  };

  const handleDelete = (id: string) => {
    setPurposes(prev => prev.filter(purpose => purpose.id !== id));
  };

  return (
    <AdminCrudPage
      title="Цели"
      items={purposes}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      hasValue={true}
    />
  );
}