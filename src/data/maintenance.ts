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

/**
 * Resale-value model (mocked). A vehicle with 100% of its maintenance inside
 * the official Ford network keeps a seal that adds a resale premium. Each
 * service done outside the network removes the seal and applies a penalty.
 */
export const resaleConfig = {
  base: 232000, // valor de revenda base estimado (R$)
  sealPremium: 14200, // prêmio do selo — RECUPERÁVEL (o selo pode voltar) (R$)
  offPenalty: 4200, // perda PERMANENTE por cada manutenção fora da rede (R$)
}

/** Seeded history — all official, so the seal starts valid. */
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
  return v.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}
