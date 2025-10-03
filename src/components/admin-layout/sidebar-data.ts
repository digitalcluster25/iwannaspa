import {
  LayoutDashboard,
  Users,
  Globe,
  MapPin,
  Tag,
  Target,
  Wrench,
  Briefcase,
} from 'lucide-react'
import { type SidebarData } from './types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin',
    email: 'admin@iwanna.com',
    avatar: '/avatars/admin.jpg',
  },
  navGroups: [
    {
      title: 'Основное',
      items: [
        {
          title: 'СПА комплексы',
          url: '/adminko',
          icon: LayoutDashboard,
        },
        {
          title: 'Лиды',
          url: '/adminko/leads',
          icon: Users,
        },
      ],
    },
    {
      title: 'Справочники',
      items: [
        {
          title: 'Страны',
          url: '/adminko/countries',
          icon: Globe,
        },
        {
          title: 'Города',
          url: '/adminko/cities',
          icon: MapPin,
        },
        {
          title: 'Категории',
          url: '/adminko/categories',
          icon: Tag,
        },
        {
          title: 'Цели',
          url: '/adminko/purposes',
          icon: Target,
        },
        {
          title: 'Удобства',
          url: '/adminko/amenities',
          icon: Wrench,
        },
        {
          title: 'Услуги',
          url: '/adminko/services',
          icon: Briefcase,
        },
      ],
    },
  ],
}
