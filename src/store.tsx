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
import { baseSubsystems, type Subsystem } from './data/vehicle'
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
    setTab('home')
  }, [])

  const currentScore = useMemo(() => {
    if (!resultReady) return scenario.baselineScore
    return scenario.newScore
  }, [resultReady, scenario])

  const subsystems = useMemo<Subsystem[]>(() => {
    if (!resultReady || scenario.healthy) return baseSubsystems
    return baseSubsystems.map((s) =>
      s.label === scenario.affectedSubsystem
        ? { ...s, value: scenario.severity === 'critical' ? 58 : 72 }
        : s
    )
  }, [resultReady, scenario])

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
