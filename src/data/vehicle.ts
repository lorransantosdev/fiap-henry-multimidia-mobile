export interface Subsystem {
  label: string
  value: number
}

export const vehicle = {
  model: 'Ford Ranger',
  variant: 'Limited 3.0 V6',
  plate: 'FRD-2E45',
  mileage: '38.240 km',
  year: '2025',
}

export const baseSubsystems: Subsystem[] = [
  { label: 'Motor', value: 94 },
  { label: 'Freios', value: 72 },
  { label: 'Bateria', value: 81 },
  { label: 'Pneus', value: 88 },
  { label: 'Fluidos', value: 91 },
]

export const healthTrend = [90, 89, 91, 88, 90, 87, 88, 86, 87, 85, 86, 87]

export interface Dealership {
  id: string
  name: string
  distance: string
  rating: number
  reviews: number
  firstSlot: string
  address: string
  phone: string
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
    phone: '(11) 4002-8922',
  },
  {
    id: 'norte',
    name: 'Ford Norte',
    distance: '11,2 km',
    rating: 4.7,
    reviews: 892,
    firstSlot: 'Amanhã — 11:20',
    address: 'Av. Braz Leme, 1.860 — Santana',
    phone: '(11) 3333-1860',
  },
  {
    id: 'leste',
    name: 'Ford Leste',
    distance: '14,8 km',
    rating: 4.6,
    reviews: 640,
    firstSlot: 'Amanhã — 14:00',
    address: 'Av. Aricanduva, 5.555 — Aricanduva',
    phone: '(11) 2222-5555',
  },
]

export interface DayOption {
  id: string
  label: string
  sub: string
}

export function buildDayOptions(from = new Date()): DayOption[] {
  const weekday = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const month = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(from)
    d.setDate(d.getDate() + i)
    const label = i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : weekday[d.getDay()]
    const sub = `${String(d.getDate()).padStart(2, '0')} ${month[d.getMonth()]}`
    return { id: d.toISOString().slice(0, 10), label, sub }
  })
}

export const timeSlots = ['08:00', '09:40', '11:20', '14:00', '16:30']

export function todayLabel(d = new Date()) {
  const month = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
  return `${String(d.getDate()).padStart(2, '0')} ${month[d.getMonth()]} ${d.getFullYear()}`
}
