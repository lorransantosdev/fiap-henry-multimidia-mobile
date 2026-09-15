export interface Subsystem {
  label: string
  value: number
}

export const driver = {
  name: 'Pedro',
  city: 'São Paulo',
}

export const vehicle = {
  model: 'Ford Ranger',
  variant: 'Limited 3.0 V6',
  plate: 'FRD-2E45',
  mileage: '38.240 km',
  year: '2025',
}

export const fleetModels = [
  'Ford Ranger',
  'Ford Territory',
  'Ford Maverick',
  'Ford Bronco Sport',
  'Ford Mustang Mach-E',
]

export const baseSubsystems: Subsystem[] = [
  { label: 'Motor', value: 94 },
  { label: 'Freios', value: 72 },
  { label: 'Bateria', value: 81 },
  { label: 'Pneus', value: 88 },
  { label: 'Fluidos', value: 91 },
]

// Health score over the last 30 days (mocked trend, oldest → newest)
export const healthTrend = [90, 89, 91, 88, 90, 87, 88, 86, 87, 85, 86, 87]

export interface Dealership {
  id: string
  name: string
  distance: string
  rating: number
  reviews: number
  firstSlot: string
  address: string
}

export const dealerships: Dealership[] = [
  {
    id: 'sp',
    name: 'Ford Center São Paulo',
    distance: '8,4 km',
    rating: 4.9,
    reviews: 1284,
    firstSlot: 'Amanhã — 09:40',
    address: 'Av. das Nações Unidas, 12.900 — Brooklin',
  },
  {
    id: 'norte',
    name: 'Ford Norte',
    distance: '11,2 km',
    rating: 4.7,
    reviews: 892,
    firstSlot: 'Amanhã — 11:20',
    address: 'Av. Braz Leme, 1.860 — Santana',
  },
  {
    id: 'leste',
    name: 'Ford Leste',
    distance: '14,8 km',
    rating: 4.6,
    reviews: 640,
    firstSlot: 'Amanhã — 14:00',
    address: 'Av. Aricanduva, 5.555 — Aricanduva',
  },
]

export interface DayOption {
  id: string
  label: string
  sub: string
}

export const dayOptions: DayOption[] = [
  { id: 'today', label: 'Hoje', sub: '15 SET' },
  { id: 'tomorrow', label: 'Amanhã', sub: '16 SET' },
  { id: 'd18', label: 'Qui', sub: '18 SET' },
  { id: 'd19', label: 'Sex', sub: '19 SET' },
]

export const timeSlots = ['09:40', '11:20', '14:00', '16:30']

export interface TimelineEntry {
  when: string
  title: string
  desc: string
  kind: 'alert' | 'service' | 'info'
}

export const timeline: TimelineEntry[] = [
  {
    when: 'Hoje',
    title: 'Anomalia detectada',
    desc: 'Henry identificou um sinal que merece atenção.',
    kind: 'alert',
  },
  {
    when: '12 SET',
    title: 'Manutenção realizada',
    desc: 'Troca de óleo e filtro — Ford Center São Paulo.',
    kind: 'service',
  },
  {
    when: '28 AGO',
    title: 'Pressão dos pneus ajustada',
    desc: 'Calibragem preventiva recomendada por Henry.',
    kind: 'info',
  },
  {
    when: '15 JUL',
    title: 'Revisão realizada',
    desc: 'Revisão de 35.000 km concluída sem pendências.',
    kind: 'service',
  },
]
