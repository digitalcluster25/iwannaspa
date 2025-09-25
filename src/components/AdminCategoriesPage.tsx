import { useState } from 'react';
import { AdminCrudPage } from './AdminCrudPage';
import { mockCategories } from '../data/mockData';
import { Category } from '../types/spa';

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  const handleAdd = (newCategory: Omit<Category, 'id'>) => {
    const category: Category = {
      id: Date.now().toString(),
      ...newCategory
    };
    setCategories(prev => [...prev, category]);
  };

  const handleEdit = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(category => 
      category.id === id ? { ...category, ...updates } : category
    ));
  };

  const handleDelete = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  return (
    <AdminCrudPage
      title="Категории"
      items={categories}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      hasValue={true}
    />
  );
}