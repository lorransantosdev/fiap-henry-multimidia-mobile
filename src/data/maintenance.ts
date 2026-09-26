export type MaintenanceNetwork = 'official' | 'off'

export interface MaintenanceRecord {
  id: string
  date: string
  label: string
  system: string
  network: MaintenanceNetwork
  dealership?: string
  scoreBefore?: number
  scoreAfter?: number
}

export const resaleConfig = {
  base: 232000,
  sealPremium: 14200,
  offPenalty: 4200,
}

export const seedMaintenance: MaintenanceRecord[] = [
  {
    id: 'm-oil',
    date: '12 SET 2026',
    label: 'Troca de óleo e filtro',
    system: 'Motor',
    network: 'official',
    dealership: 'Ford Center São Paulo',
  },
  {
    id: 'm-tires',
    date: '28 AGO 2026',
    label: 'Calibragem e rodízio de pneus',
    system: 'Pneus',
    network: 'official',
    dealership: 'Ford Center São Paulo',
  },
  {
    id: 'm-review',
    date: '15 JUL 2026',
    label: 'Revisão de 35.000 km',
    system: 'Geral',
    network: 'official',
    dealership: 'Ford Norte',
  },
]

export function formatBRL(v: number): string {
  try {
    return v.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    })
  } catch {
    return `R$ ${Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
  }
}
