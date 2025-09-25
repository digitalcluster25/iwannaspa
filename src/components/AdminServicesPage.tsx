import { useState } from 'react';
import { AdminCrudPage } from './AdminCrudPage';
import { mockServiceTemplates } from '../data/mockData';
import { ServiceTemplate } from '../types/spa';

export function AdminServicesPage() {
  const [services, setServices] = useState<ServiceTemplate[]>(mockServiceTemplates);

  const handleAdd = (newService: Omit<ServiceTemplate, 'id'>) => {
    const service: ServiceTemplate = {
      id: Date.now().toString(),
      ...newService
    };
    setServices(prev => [...prev, service]);
  };

  const handleEdit = (id: string, updates: Partial<ServiceTemplate>) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, ...updates } : service
    ));
  };

  const handleDelete = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  return (
    <AdminCrudPage
      title="Услуги"
      items={services}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      hasValue={false}
    />
  );
}