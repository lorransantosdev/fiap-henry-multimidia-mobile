import type { ComponentProps } from 'react'
import type { Ionicons } from '@expo/vector-icons'

export type IconName = ComponentProps<typeof Ionicons>['name']

export type Priority = 'Baixa' | 'Média' | 'Alta'
export type Severity = 'healthy' | 'attention' | 'critical'

export interface Subsystem {
  label: string
  value: number
}

export interface Scenario {
  id: string
  demoLabel: string
  icon: IconName
  healthy: boolean
  system: string
  baselineScore: number
  newScore: number
  priority: Priority
  severity: Severity
  probability: number
  headline: string
  subtitle: string
  meaning: string[]
  recommendation: string
  estimatedTime: string
  drivingNote: string
  affectedSubsystem?: string
  voiceLine: string
  spoken: string
  sharedData: string[]
  accent: string
}

export const scenarios: Record<string, Scenario> = {
  brakes: {
    id: 'brakes',
    demoLabel: 'Freios',
    icon: 'disc-outline',
    healthy: false,
    system: 'Sistema de frenagem',
    baselineScore: 87,
    newScore: 72,
    priority: 'Média',
    severity: 'attention',
    probability: 78,
    headline: 'Henry detectou algo no seu veículo',
    subtitle: 'Identificamos um sinal que merece atenção.',
    meaning: [
      'Seu veículo apresentou sinais de desgaste no sistema de frenagem acima do padrão esperado para esta quilometragem.',
      'Não identificamos uma falha imediata, mas recomendamos uma inspeção preventiva.',
    ],
    recommendation: 'Agendar uma inspeção preventiva.',
    estimatedTime: '2h30',
    drivingNote:
      'Você pode continuar dirigindo, mas recomendamos realizar a inspeção nos próximos 1.500 km.',
    affectedSubsystem: 'Freios',
    voiceLine:
      'Identifiquei um sinal no sistema de frenagem. Quer que eu explique?',
    spoken:
      'Pedro, notei desgaste no freio, com 78% de probabilidade. Recomendo uma inspeção preventiva.',
    sharedData: [
      'Sintomas identificados',
      'Health Score',
      'Histórico relevante',
      'Probabilidade de falha',
      'Recomendação de inspeção',
    ],
    accent: '#F59E0B',
  },
  battery: {
    id: 'battery',
    demoLabel: 'Bateria',
    icon: 'battery-dead-outline',
    healthy: false,
    system: 'Bateria',
    baselineScore: 87,
    newScore: 61,
    priority: 'Alta',
    severity: 'critical',
    probability: 84,
    headline: 'Henry detectou algo no seu veículo',
    subtitle: 'Identificamos sinais de degradação da bateria.',
    meaning: [
      'Os dados indicam sinais compatíveis com degradação da bateria acima do esperado, especialmente na retenção de carga durante as partidas.',
      'Ainda não há uma falha impeditiva, mas recomendamos uma verificação com prioridade para evitar uma pane inesperada.',
    ],
    recommendation: 'Agendar uma verificação da bateria.',
    estimatedTime: '1h15',
    drivingNote:
      'O veículo continua operacional, mas recomendamos a verificação nos próximos dias para evitar uma pane inesperada.',
    affectedSubsystem: 'Bateria',
    voiceLine:
      'Identifiquei sinais de degradação na bateria. Quer que eu explique?',
    spoken:
      'Pedro, a bateria está com sinais de desgaste, 84% de probabilidade. Recomendo verificar com prioridade.',
    sharedData: [
      'Sintomas identificados',
      'Health Score',
      'Ciclos de carga da bateria',
      'Probabilidade de falha',
      'Recomendação de verificação',
    ],
    accent: '#DC2626',
  },
  tires: {
    id: 'tires',
    demoLabel: 'Pneus',
    icon: 'ellipse-outline',
    healthy: false,
    system: 'Pneus',
    baselineScore: 87,
    newScore: 79,
    priority: 'Média',
    severity: 'attention',
    probability: 66,
    headline: 'Henry detectou algo no seu veículo',
    subtitle: 'Identificamos variações na condição dos pneus.',
    meaning: [
      'Os dados indicam sinais compatíveis com desgaste irregular e variação de pressão em um dos pneus acima do padrão esperado.',
      'Não identificamos um risco imediato, mas recomendamos uma inspeção preventiva para preservar a segurança e o consumo.',
    ],
    recommendation: 'Agendar alinhamento e inspeção dos pneus.',
    estimatedTime: '1h45',
    drivingNote:
      'Você pode continuar dirigindo, mas recomendamos realizar a inspeção nos próximos 1.500 km.',
    affectedSubsystem: 'Pneus',
    voiceLine:
      'Identifiquei variações na condição dos pneus. Quer que eu explique?',
    spoken:
      'Pedro, notei variação nos pneus, 66% de probabilidade. Recomendo uma inspeção preventiva.',
    sharedData: [
      'Sintomas identificados',
      'Health Score',
      'Pressão e desgaste por pneu',
      'Probabilidade de falha',
      'Recomendação de inspeção',
    ],
    accent: '#F59E0B',
  },
  healthy: {
    id: 'healthy',
    demoLabel: 'Saúde normal',
    icon: 'shield-checkmark-outline',
    healthy: true,
    system: 'Diagnóstico geral',
    baselineScore: 87,
    newScore: 94,
    priority: 'Baixa',
    severity: 'healthy',
    probability: 4,
    headline: 'Seu veículo está saudável',
    subtitle: 'Nenhuma anomalia identificada no momento.',
    meaning: [
      'Analisamos os principais sistemas do seu veículo e não identificamos sinais fora do padrão esperado.',
      'Continuaremos monitorando de forma contínua e preventiva. Você será avisado caso algo mude.',
    ],
    recommendation: 'Nenhuma ação necessária no momento.',
    estimatedTime: '—',
    drivingNote:
      'Seu Ford está em ótimas condições. Continue com as revisões periódicas recomendadas.',
    voiceLine:
      'Verifiquei os sistemas do seu veículo e está tudo dentro do esperado.',
    spoken:
      'Pedro, verifiquei seu Ford e está tudo certo. Sigo monitorando.',
    sharedData: [],
    accent: '#16A34A',
  },
}

export const scenarioOrder = ['brakes', 'battery', 'tires', 'healthy'] as const
