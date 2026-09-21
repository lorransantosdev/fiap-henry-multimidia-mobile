import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { scenarios, type Scenario } from './data/scenarios'
import { baseSubsystems, dealerships, type Subsystem } from './data/vehicle'
import {
  resaleConfig,
  seedMaintenance,
  type MaintenanceRecord,
} from './data/maintenance'
import {
  cancel as cancelVoice,
  initVoices,
  isVoiceEnabled,
  onSpeakingChange,
  setVoiceEnabled,
} from './voice'

export type Tab = 'home' | 'vehicle' | 'nav' | 'music' | 'henry'

export type FlowStep =
  | 'idle'
  | 'alert'
  | 'healthy-result'
  | 'dealership'
  | 'scheduling'
  | 'confirmation'

interface Booking {
  dealershipId: string | null
  dayId: string | null
  time: string | null
}

interface AppState {
  tab: Tab
  setTab: (t: Tab) => void

  scenarioId: string
  scenario: Scenario

  /** an anomaly has been surfaced and a recommendation is pending */
  hasRecommendation: boolean
  /** the demo has produced a result at least once (drives health score) */
  resultReady: boolean

  flowStep: FlowStep
  setFlowStep: (s: FlowStep) => void

  /** Henry's proactive notification (toast) is visible */
  henryNotice: boolean
  dismissNotice: () => void

  currentScore: number
  subsystems: Subsystem[]

  booking: Booking
  setBooking: (b: Partial<Booking>) => void

  demoOpen: boolean
  setDemoOpen: (v: boolean) => void

  henryOpen: boolean
  setHenryOpen: (v: boolean) => void

  /** Henry is currently speaking aloud */
  speaking: boolean
  voiceEnabled: boolean
  toggleVoice: () => void

  // --- Maintenance seal / resale value ---
  maintenance: MaintenanceRecord[]
  /** true while 100% of maintenance is inside the official Ford network */
  sealActive: boolean
  officialCount: number
  offCount: number
  /** % of maintenance done in the official network */
  officialPct: number
  /** current estimated resale value (R$) */
  resaleValue: number
  /** resale value with the seal kept (ideal) */
  resaleWithSeal: number
  /** the recoverable seal premium (R$) */
  potentialLoss: number
  /** amount you can win back by reactivating the seal (R$) */
  recoverable: number
  /** total permanent (unrecoverable) loss so far (R$) */
  permanentLoss: number
  /** permanent loss applied per off-network service (R$) */
  permanentPenalty: number
  /** the off-network detection overlay is visible */
  offNetworkOpen: boolean
  simulateOffNetwork: () => void
  closeOffNetwork: () => void
  addOfficialMaintenance: () => void

  /** start the simulate → analyze → result flow for a scenario */
  runScenario: (id: string) => void
  /** open the alert detail again (from home / henry) */
  openAlert: () => void
  /** reset the whole demo back to a clean state */
  resetDemo: () => void
  dismissAlert: () => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<Tab>('home')
  const [scenarioId, setScenarioId] = useState<string>('brakes')
  const [hasRecommendation, setHasRecommendation] = useState(false)
  const [resultReady, setResultReady] = useState(false)
  const [flowStep, setFlowStep] = useState<FlowStep>('idle')
  const [booking, setBookingState] = useState<Booking>({
    dealershipId: null,
    dayId: null,
    time: null,
  })
  const [demoOpen, setDemoOpen] = useState(false)
  const [henryOpen, setHenryOpen] = useState(false)
  const [henryNotice, setHenryNotice] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabledState] = useState(isVoiceEnabled())
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>(seedMaintenance)
  const [scoreOverride, setScoreOverride] = useState<number | null>(null)
  const [offNetworkOpen, setOffNetworkOpen] = useState(false)

  const scenario = scenarios[scenarioId]

  useEffect(() => {
    initVoices()
    return onSpeakingChange(setSpeaking)
  }, [])

  const toggleVoice = useCallback(() => {
    setVoiceEnabledState((prev) => {
      const next = !prev
      setVoiceEnabled(next)
      return next
    })
  }, [])

  const setBooking = useCallback((b: Partial<Booking>) => {
    setBookingState((prev) => ({ ...prev, ...b }))
  }, [])

  // Demo trigger: Henry immediately "knows" — no scan. He surfaces a proactive
  // notification and only explains further if the driver accepts.
  const runScenario = useCallback((id: string) => {
    cancelVoice()
    const sc = scenarios[id]
    setScenarioId(id)
    setDemoOpen(false)
    setHenryOpen(false)
    setBookingState({ dealershipId: null, dayId: null, time: null })
    setResultReady(true)
    setHasRecommendation(!sc.healthy)
    setFlowStep('idle')
    setHenryNotice(true)
  }, [])

  const dismissNotice = useCallback(() => {
    cancelVoice()
    setHenryNotice(false)
  }, [])

  const openAlert = useCallback(() => {
    setHenryOpen(false)
    setHenryNotice(false)
    setFlowStep('alert')
  }, [])

  const dismissAlert = useCallback(() => {
    setFlowStep('idle')
  }, [])

  const resetDemo = useCallback(() => {
    cancelVoice()
    setHasRecommendation(false)
    setResultReady(false)
    setFlowStep('idle')
    setScenarioId('brakes')
    setBookingState({ dealershipId: null, dayId: null, time: null })
    setDemoOpen(false)
    setHenryOpen(false)
    setHenryNotice(false)
    setMaintenance(seedMaintenance)
    setScoreOverride(null)
    setOffNetworkOpen(false)
    setTab('home')
  }, [])

  const currentScore = useMemo(() => {
    if (scoreOverride !== null) return scoreOverride
    if (!resultReady) return scenario.baselineScore
    return scenario.newScore
  }, [scoreOverride, resultReady, scenario])

  const subsystems = useMemo<Subsystem[]>(() => {
    if (scoreOverride !== null || !resultReady || scenario.healthy) return baseSubsystems
    return baseSubsystems.map((s) =>
      s.label === scenario.affectedSubsystem
        ? { ...s, value: scenario.severity === 'critical' ? 58 : 72 }
        : s
    )
  }, [scoreOverride, resultReady, scenario])

  // --- Maintenance seal & resale value (derived) ---
  // The seal is RECOVERABLE and never punitive: it reflects your current
  // trajectory (is the most recent service in the network?), not a permanent
  // mark. A service outside the network simply pauses it until the next
  // official one reactivates it. Resale value follows the same logic — no
  // permanent penalty, only the seal premium that you keep or win back.
  const offCount = maintenance.filter((m) => m.network === 'off').length
  const officialCount = maintenance.length - offCount
  const sealActive = maintenance.length ? maintenance[0].network !== 'off' : true
  const officialPct = maintenance.length
    ? Math.round((officialCount / maintenance.length) * 100)
    : 100
  // Permanent loss: each off-network service leaves a small mark that never
  // returns. The seal premium, on the other hand, is fully recoverable.
  const permanentLoss = offCount * resaleConfig.offPenalty
  const resaleValue =
    resaleConfig.base + (sealActive ? resaleConfig.sealPremium : 0) - permanentLoss
  const resaleWithSeal = resaleConfig.base + resaleConfig.sealPremium
  /** amount you can win back by reactivating the seal (0 when already active) */
  const recoverable = sealActive ? 0 : resaleConfig.sealPremium
  /** the recoverable seal premium (shown as the gain of staying in-network) */
  const potentialLoss = resaleConfig.sealPremium
  /** permanent loss applied per off-network service */
  const permanentPenalty = resaleConfig.offPenalty

  // Demo: the car detected a health recovery with no dealership record →
  // register a maintenance done OUTSIDE the official network (breaks the seal).
  const simulateOffNetwork = useCallback(() => {
    cancelVoice()
    const sc = scenarios[scenarioId]
    const system = sc.healthy ? 'Freios' : sc.system
    const before = scoreOverride ?? (resultReady ? sc.newScore : 74)
    setMaintenance((prev) => [
      {
        id: 'off-' + Date.now(),
        date: '21 SET 2026',
        label: `Reparo — ${system}`,
        system,
        network: 'off',
        dealership: 'Oficina externa',
        scoreBefore: before,
        scoreAfter: 91,
      },
      ...prev,
    ])
    setScoreOverride(91)
    setHasRecommendation(false)
    setResultReady(true)
    setDemoOpen(false)
    setHenryNotice(false)
    setFlowStep('idle')
    setOffNetworkOpen(true)
  }, [scenarioId, scoreOverride, resultReady])

  const closeOffNetwork = useCallback(() => {
    cancelVoice()
    setOffNetworkOpen(false)
  }, [])

  // Official service completed → record it inside the network (keeps the seal).
  const addOfficialMaintenance = useCallback(() => {
    const sc = scenarios[scenarioId]
    if (sc.healthy) return
    const dealer = dealerships.find((d) => d.id === booking.dealershipId)
    setMaintenance((prev) => {
      if (prev.some((r) => r.id === 'official-current')) return prev
      return [
        {
          id: 'official-current',
          date: '21 SET 2026',
          label: `Inspeção — ${sc.system}`,
          system: sc.system,
          network: 'official',
          dealership: dealer?.name ?? 'Rede Ford',
          scoreBefore: sc.newScore,
          scoreAfter: 93,
        },
        ...prev,
      ]
    })
  }, [scenarioId, booking.dealershipId])

  const value: AppState = {
    tab,
    setTab,
    scenarioId,
    scenario,
    hasRecommendation,
    resultReady,
    flowStep,
    setFlowStep,
    henryNotice,
    dismissNotice,
    currentScore,
    subsystems,
    booking,
    setBooking,
    demoOpen,
    setDemoOpen,
    henryOpen,
    setHenryOpen,
    speaking,
    voiceEnabled,
    toggleVoice,
    maintenance,
    sealActive,
    officialCount,
    offCount,
    officialPct,
    resaleValue,
    resaleWithSeal,
    potentialLoss,
    recoverable,
    permanentLoss,
    permanentPenalty,
    offNetworkOpen,
    simulateOffNetwork,
    closeOffNetwork,
    addOfficialMaintenance,
    runScenario,
    openAlert,
    resetDemo,
    dismissAlert,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
