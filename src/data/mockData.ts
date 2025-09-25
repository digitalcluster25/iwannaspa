import { Spa, City, Category, Purpose, Amenity, ServiceTemplate } from '../types/spa';

export const mockSpas: Spa[] = [
  {
    id: '1',
    name: 'Luxury Wellness Resort',
    description: 'Премиальный СПА-курорт с полным спектром wellness услуг. Включает массажные процедуры, термальные ванны, йогу и медитацию.',
    price: 3400,
    rating: 4.8,
    reviewCount: 127,
    location: 'Киев',
    images: [
      'https://via.placeholder.com/800x600/e2e8f0/64748b?text=Luxury+Wellness+Resort',
      'https://via.placeholder.com/800x600/f1f5f9/64748b?text=Spa+Interior'
    ],
    amenities: ['Сауна', 'Бассейн', 'Йога', 'Ресторан'],
    services: [
      {
        id: 'massage',
        name: 'Расслабляющий массаж',
        description: 'Классический массаж всего тела с использованием ароматических масел',
        price: 1200,
        image: '/api/placeholder/80/80'
      },
      {
        id: 'facial',
        name: 'Увлажняющая маска для лица',
        description: 'Глубоко увлажняющая процедура с натуральными компонентами',
        price: 800,
        image: '/api/placeholder/80/80'
      },
      {
        id: 'sauna',
        name: 'Сеанс в финской сауне',
        description: 'Традиционная финская сауна с вениками и ароматерапией',
        price: 600,
        image: '/api/placeholder/80/80'
      }
    ],
    contactInfo: {
      phone: '+380 44 123 45 67',
      email: 'info@luxurywellness.ua',
      workingHours: 'Пн-Вс 9:00 - 22:00',
      whatsapp: '+380 44 123 45 67',
      telegram: '@luxurywellness'
    },
    category: 'wellness',
    purpose: 'relaxation',
    featured: true,
    active: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Термальный комплекс "Источник"',
    description: 'Уникальный термальный СПА-комплекс с естественными горячими источниками и лечебными процедурами.',
    price: 2500,
    rating: 4.6,
    reviewCount: 89,
    location: 'Буковель',
    images: [
      'https://via.placeholder.com/800x600/e2e8f0/64748b?text=Thermal+Springs'
    ],
    amenities: ['Термальные ванны', 'Грязелечение', 'Сауна'],
    services: [
      {
        id: 'thermal',
        name: 'Термальные ванны',
        description: 'Лечебное купание в природных горячих источниках',
        price: 500,
        image: '/api/placeholder/80/80'
      },
      {
        id: 'mud',
        name: 'Грязелечение',
        description: 'Лечебные грязевые аппликации для оздоровления',
        price: 700,
        image: '/api/placeholder/80/80'
      },
      {
        id: 'massage',
        name: 'Массаж',
        description: 'Расслабляющий массаж после термальных процедур',
        price: 800,
        image: '/api/placeholder/80/80'
      }
    ],
    contactInfo: {
      phone: '+380 95 234 56 78',
      email: 'info@thermal-spring.ua',
      workingHours: 'Пн-Вс 8:00 - 21:00',
      whatsapp: '+380 95 234 56 78',
      telegram: '@thermalspring'
    },
    category: 'thermal',
    purpose: 'health',
    featured: false,
    active: true,
    createdAt: '2024-02-01'
  },
  {
    id: '3',
    name: 'Medical SPA Clinic',
    description: 'Медицинский СПА-центр с профессиональными косметологическими и оздоровительными процедурами.',
    price: 3100,
    rating: 4.9,
    reviewCount: 156,
    location: 'Львов',
    images: [
      'https://via.placeholder.com/800x600/e2e8f0/64748b?text=Medical+SPA+Clinic'
    ],
    amenities: [],
    services: [
      {
        id: 'cosmetology',
        name: 'Косметология',
        description: 'Профессиональная косметология для омоложения',
        price: 1500,
        image: '/api/placeholder/80/80'
      },
      {
        id: 'massage',
        name: 'Массаж',
        description: 'Лечебный и расслабляющий массаж',
        price: 1200,
        image: '/api/placeholder/80/80'
      },
      {
        id: 'cryo',
        name: 'Криотерапия',
        description: 'Лечение холодом для восстановления организма',
        price: 900,
        image: '/api/placeholder/80/80'
      },
      {
        id: 'physio',
        name: 'Физиотерапия',
        description: 'Физиотерапевтические процедуры для лечения и реабилитации',
        price: 800,
        image: '/api/placeholder/80/80'
      }
    ],
    contactInfo: {
      phone: '+380 32 345 67 89',
      email: 'clinic@medical-spa.ua',
      workingHours: 'Пн-Пт 9:00 - 20:00, Сб-Вс 10:00 - 18:00',
      whatsapp: '+380 32 345 67 89',
      telegram: '@medicalspa'
    },
    category: 'medical',
    purpose: 'health',
    featured: true,
    active: true,
    createdAt: '2024-01-20'
  },
  {
    id: '4',
    name: 'Beauty SPA "Эльф"',
    description: 'Элитный beauty СПА с авторскими программами красоты и релаксации.',
    price: 2200,
    rating: 4.7,
    reviewCount: 93,
    location: 'Одесса',
    images: [
      'https://via.placeholder.com/800x600/e2e8f0/64748b?text=Beauty+SPA'
    ],
    amenities: ['Массаж лица', 'Маникюр', 'Педикюр', 'Обертывания'],
    services: [
      {
        id: 'facial-massage',
        name: 'Массаж лица',
        description: 'Омолаживающий массаж для упругости кожи',
        price: 600,
        image: '/api/placeholder/80/80'
      },
      {
        id: 'manicure',
        name: 'Премиум маникюр',
        description: 'Профессиональный уход за руками и ногтями',
        price: 400,
        image: '/api/placeholder/80/80'
      }
    ],
    contactInfo: {
      phone: '+380 48 456 78 90',
      email: 'beauty@elf-spa.ua',
      workingHours: 'Пн-Вс 10:00 - 21:00',
      whatsapp: '+380 48 456 78 90',
      telegram: '@elfspa'
    },
    category: 'beauty',
    purpose: 'beauty',
    featured: false,
    active: true,
    createdAt: '2024-02-10'
  },
  {
    id: '5',
    name: 'Аква Релакс',
    description: 'Современный СПА-центр с уникальными водными процедурами и расслабляющими программами.',
    price: 1900,
    rating: 4.5,
    reviewCount: 64,
    location: 'Киев',
    images: [
      'https://via.placeholder.com/800x600/e2e8f0/64748b?text=Aqua+Relax'
    ],
    amenities: ['Аквамассаж', 'Гидротерапия', 'Соляная комната', 'Фитобар'],
    services: [
      {
        id: 'aqua-massage',
        name: 'Аквамассаж',
        description: 'Расслабляющий массаж в воде',
        price: 800,
        image: '/api/placeholder/80/80'
      },
      {
        id: 'hydro',
        name: 'Гидротерапия',
        description: 'Лечебные водные процедуры',
        price: 650,
        image: '/api/placeholder/80/80'
      }
    ],
    contactInfo: {
      phone: '+380 44 567 89 01',
      email: 'relax@aqua-spa.ua',
      workingHours: 'Пн-Вс 9:00 - 22:00',
      whatsapp: '+380 44 567 89 01',
      telegram: '@aquarelax'
    },
    category: 'wellness',
    purpose: 'relaxation',
    featured: false,
    active: false,
    createdAt: '2024-01-25'
  },
  {
    id: '6',
    name: 'Карпатский Wellness',
    description: 'Горный СПА-комплекс с традиционными карпатскими оздоровительными методиками.',
    price: 2400,
    rating: 4.4,
    reviewCount: 78,
    location: 'Буковель',
    images: [
      'https://via.placeholder.com/800x600/e2e8f0/64748b?text=Carpathian+Wellness'
    ],
    amenities: ['Травяные ванны', 'Массаж камнями', 'Кедровая бочка', 'Фитотерапия'],
    services: [
      {
        id: 'herbal-bath',
        name: 'Травяные ванны',
        description: 'Лечебные ванны с карпатскими травами',
        price: 550,
        image: '/api/placeholder/80/80'
      },
      {
        id: 'stone-massage',
        name: 'Массаж камнями',
        description: 'Расслабляющий массаж горячими камнями',
        price: 900,
        image: '/api/placeholder/80/80'
      }
    ],
    contactInfo: {
      phone: '+380 95 678 90 12',
      email: 'wellness@carpathian.ua',
      workingHours: 'Пн-Вс 8:00 - 20:00',
      whatsapp: '+380 95 678 90 12',
      telegram: '@carpathianwellness'
    },
    category: 'wellness',
    purpose: 'detox',
    featured: false,
    active: true,
    createdAt: '2024-02-05'
  },
  {
    id: '7',
    name: 'Фитнес СПА "Энергия"',
    description: 'Современный спортивно-оздоровительный комплекс с фитнес-программами и восстановительными процедурами.',
    price: 1800,
    rating: 4.3,
    reviewCount: 54,
    location: 'Киев',
    images: [
      'https://via.placeholder.com/800x600/e2e8f0/64748b?text=Fitness+SPA'
    ],
    amenities: ['Тренажерный зал', 'Протеиновый бар'],
    services: [
      {
        id: 'massage',
        name: 'Массаж',
        description: 'Восстановительный массаж после тренировок',
        price: 700,
        image: '/api/placeholder/80/80'
      },
      {
        id: 'cryo',
        name: 'Криотерапия',
        description: 'Процедура восстановления в холодовой камере',
        price: 450,
        image: '/api/placeholder/80/80'
      }
    ],
    contactInfo: {
      phone: '+380 44 789 01 23',
      email: 'energy@fitness-spa.ua',
      workingHours: 'Пн-Вс 6:00 - 23:00',
      whatsapp: '+380 44 789 01 23',
      telegram: '@fitnessspa'
    },
    category: 'wellness',
    purpose: 'fitness',
    featured: false,
    active: true,
    createdAt: '2024-02-15'
  },
  {
    id: '8',
    name: 'Детокс центр "Чистота"',
    description: 'Специализированный центр детоксикации организма с авторскими программами очищения.',
    price: 2800,
    rating: 4.6,
    reviewCount: 67,
    location: 'Одесса',
    images: [
      'https://via.placeholder.com/800x600/e2e8f0/64748b?text=Detox+Center'
    ],
    amenities: ['Детокс программы', 'Лимфодренаж', 'Инфракрасная сауна', 'Фреш-бар'],
    services: [
      {
        id: 'detox-program',
        name: 'Программа детоксикации',
        description: 'Комплексная программа очищения организма',
        price: 1200,
        image: '/api/placeholder/80/80'
      },
      {
        id: 'lymph-drainage',
        name: 'Лимфодренажный массаж',
        description: 'Массаж для улучшения лимфотока',
        price: 800,
        image: '/api/placeholder/80/80'
      }
    ],
    contactInfo: {
      phone: '+380 48 890 12 34',
      email: 'detox@clean-center.ua',
      workingHours: 'Пн-Сб 9:00 - 21:00',
      whatsapp: '+380 48 890 12 34',
      telegram: '@detoxcenter'
    },
    category: 'medical',
    purpose: 'detox',
    featured: true,
    active: true,
    createdAt: '2024-01-30'
  }
];

// Reference data
export const mockCities: City[] = [
  { id: '1', name: 'Киев', active: true },
  { id: '2', name: 'Одесса', active: true },
  { id: '3', name: 'Львов', active: true },
  { id: '4', name: 'Буковель', active: true },
  { id: '5', name: 'Харьков', active: false },
];

export const mockCategories: Category[] = [
  { id: '1', name: 'Велнес', value: 'wellness', active: true },
  { id: '2', name: 'Медицинский', value: 'medical', active: true },
  { id: '3', name: 'Красота', value: 'beauty', active: true },
  { id: '4', name: 'Термальный', value: 'thermal', active: true },
];

export const mockPurposes: Purpose[] = [
  { id: '1', name: 'Расслабление', value: 'relaxation', active: true },
  { id: '2', name: 'Здоровье', value: 'health', active: true },
  { id: '3', name: 'Красота', value: 'beauty', active: true },
  { id: '4', name: 'Детокс', value: 'detox', active: true },
  { id: '5', name: 'Фитнес', value: 'fitness', active: true },
];

export const mockAmenities: Amenity[] = [
  { id: '2', name: 'Сауна', active: true },
  { id: '3', name: 'Бассейн', active: true },
  { id: '4', name: 'Йога', active: true },
  { id: '5', name: 'Ресторан', active: true },
  { id: '6', name: 'Термальные ванны', active: true },
  { id: '7', name: 'Грязелечение', active: true },
  { id: '11', name: 'Массаж лица', active: true },
  { id: '12', name: 'Маникюр', active: true },
  { id: '13', name: 'Педикюр', active: true },
  { id: '14', name: 'Обертывания', active: true },
  { id: '15', name: 'Аквамассаж', active: true },
  { id: '16', name: 'Гидротерапия', active: true },
  { id: '17', name: 'Соляная комната', active: true },
  { id: '18', name: 'Фитобар', active: true },
  { id: '19', name: 'Травяные ванны', active: true },
  { id: '20', name: 'Массаж камнями', active: true },
  { id: '21', name: 'Кедровая бочка', active: true },
  { id: '22', name: 'Фитотерапия', active: true },
  { id: '23', name: 'Тренажерный зал', active: true },
  { id: '24', name: 'Спортмассаж', active: true },
  { id: '25', name: 'Криосауна', active: true },
  { id: '26', name: 'Протеиновый бар', active: true },
  { id: '27', name: 'Детокс программы', active: true },
  { id: '28', name: 'Лимфодренаж', active: true },
  { id: '29', name: 'Инфракрасная сауна', active: true },
  { id: '30', name: 'Фреш-бар', active: true },
];

export const mockServiceTemplates: ServiceTemplate[] = [
  { id: '1', name: 'Косметология', active: true },
  { id: '2', name: 'Массаж', active: true },
  { id: '3', name: 'Криотерапия', active: true },
  { id: '4', name: 'Физиотерапия', active: true },
  { id: '5', name: 'Расслабляющий массаж', active: true },
  { id: '6', name: 'Увлажняющая маска для лица', active: true },
  { id: '7', name: 'Сеанс в финской сауне', active: true },
  { id: '8', name: 'Термальные ванны', active: true },
  { id: '9', name: 'Грязелечение', active: true },
  { id: '10', name: 'Косметологические процедуры', active: true },
  { id: '11', name: 'Массаж лица', active: true },
  { id: '12', name: 'Премиум маникюр', active: true },
  { id: '13', name: 'Аквамассаж', active: true },
  { id: '14', name: 'Гидротерапия', active: true },
  { id: '15', name: 'Травяные ванны', active: true },
  { id: '16', name: 'Массаж камнями', active: true },
  { id: '17', name: 'Спортивный массаж', active: true },
  { id: '18', name: 'Криосауна', active: true },
  { id: '19', name: 'Программа детоксикации', active: true },
  { id: '20', name: 'Лимфодренажный массаж', active: true },
];