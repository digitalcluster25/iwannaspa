import {
  LayoutDashboard,
  Users,
  Globe,
  MapPin,
  Tag,
  Target,
  Wrench,
  Briefcase,
  Building2,
} from 'lucide-react'

export interface NavItem {
  title: string
  url?: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
  items?: NavItem[]
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface SidebarData {
  user: {
    name: string
    email: string
    avatar?: string
  }
  navGroups: NavGroup[]
}

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin',
    email: 'admin@iwanna.com',
    avatar: '/avatars/admin.jpg',
  },
  navGroups: [
    {
      title: 'Управление',
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
        {
          title: 'Бренды',
          url: '/adminko/brands',
          icon: Building2,
        },
        {
          title: 'Пользователи',
          url: '/adminko/users',
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
