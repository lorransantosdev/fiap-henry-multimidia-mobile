import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { scenarios, type Scenario } from '@/data/scenarios'
import { baseSubsystems, dealerships, todayLabel, type Subsystem } from '@/data/vehicle'
import { resaleConfig, seedMaintenance, type MaintenanceRecord } from '@/data/maintenance'
import { signIn as authSignIn, type Session } from '@/services/auth'
import { load, save, StorageKeys } from '@/services/storage'
import { onSpeakingChange, setVoiceEnabled, stopSpeaking } from '@/services/voice'

export type BookingStatus = 'scheduled' | 'completed' | 'cancelled'

export interface Booking {
  id: string
  scenarioId: string
  service: string
  dealershipId: string
  dayId: string
  dayLabel: string
  time: string
  status: BookingStatus
  notes?: string
  createdAt: string
}

export interface BookingDraft {
  editingId: string | null
  dealershipId: string | null
  dayId: string | null
  dayLabel: string | null
  time: string | null
  notes: string
}

const emptyDraft: BookingDraft = {
  editingId: null,
  dealershipId: null,
  dayId: null,
  dayLabel: null,
  time: null,
  notes: '',
}

interface DemoState {
  scenarioId: string
  resultReady: boolean
  hasRecommendation: boolean
  scoreOverride: number | null
}

const initialDemo: DemoState = {
  scenarioId: 'brakes',
  resultReady: false,
  hasRecommendation: false,
  scoreOverride: null,
}

interface AppState {
  hydrated: boolean

  session: Session | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>

  scenario: Scenario
  hasRecommendation: boolean
  resultReady: boolean
  currentScore: number
  subsystems: Subsystem[]
  noticeVisible: boolean
  dismissNotice: () => void
  runScenario: (id: string) => void
  resetDemo: () => void

  speaking: boolean
  voiceEnabled: boolean
  toggleVoice: () => void

  draft: BookingDraft
  setDraft: (d: Partial<BookingDraft>) => void
  startBooking: (editingId?: string) => void
  commitDraft: () => Booking | null
  bookings: Booking[]
  updateBooking: (id: string, patch: Partial<Booking>) => void
  cancelBooking: (id: string) => void
  deleteBooking: (id: string) => void
  completeBooking: (id: string) => void

  maintenance: MaintenanceRecord[]
  addMaintenance: (r: Omit<MaintenanceRecord, 'id'>) => void
  deleteMaintenance: (id: string) => void
  simulateOffNetwork: () => void
  sealActive: boolean
  officialCount: number
  offCount: number
  officialPct: number
  resaleValue: number
  resaleWithSeal: number
  recoverable: number
  permanentLoss: number
  sealPremium: number
  permanentPenalty: number
}

const AppContext = createContext<AppState | null>(null)

const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [demo, setDemo] = useState<DemoState>(initialDemo)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>(seedMaintenance)
  const [voiceEnabled, setVoiceEnabledState] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const [noticeVisible, setNoticeVisible] = useState(false)
  const [draft, setDraftState] = useState<BookingDraft>(emptyDraft)

  useEffect(() => {
    ;(async () => {
      const [s, d, b, m, st] = await Promise.all([
        load<Session | null>(StorageKeys.session, null),
        load<DemoState>(StorageKeys.demo, initialDemo),
        load<Booking[]>(StorageKeys.bookings, []),
        load<MaintenanceRecord[]>(StorageKeys.maintenance, seedMaintenance),
        load<{ voiceEnabled: boolean }>(StorageKeys.settings, { voiceEnabled: true }),
      ])
      setSession(s)
      setDemo(scenarios[d.scenarioId] ? d : initialDemo)
      setBookings(b)
      setMaintenance(m)
      setVoiceEnabledState(st.voiceEnabled)
      setVoiceEnabled(st.voiceEnabled)
      setHydrated(true)
    })()
    return onSpeakingChange(setSpeaking)
  }, [])

  useEffect(() => {
    if (hydrated) save(StorageKeys.demo, demo)
  }, [demo, hydrated])
  useEffect(() => {
    if (hydrated) save(StorageKeys.bookings, bookings)
  }, [bookings, hydrated])
  useEffect(() => {
    if (hydrated) save(StorageKeys.maintenance, maintenance)
  }, [maintenance, hydrated])
  useEffect(() => {
    if (hydrated) save(StorageKeys.settings, { voiceEnabled })
  }, [voiceEnabled, hydrated])

  const signIn = useCallback(async (email: string, password: string) => {
    const s = await authSignIn(email, password)
    setSession(s)
    await save(StorageKeys.session, s)
  }, [])

  const signOut = useCallback(async () => {
    stopSpeaking()
    setNoticeVisible(false)
    setSession(null)
    await save(StorageKeys.session, null)
  }, [])

  const toggleVoice = useCallback(() => {
    setVoiceEnabledState((prev) => {
      setVoiceEnabled(!prev)
      return !prev
    })
  }, [])

  const scenario = scenarios[demo.scenarioId] ?? scenarios.brakes

  const runScenario = useCallback((id: string) => {
    stopSpeaking()
    const sc = scenarios[id]
    if (!sc) return
    setDemo({
      scenarioId: id,
      resultReady: true,
      hasRecommendation: !sc.healthy,
      scoreOverride: null,
    })
    setDraftState(emptyDraft)
    setNoticeVisible(true)
  }, [])

  const dismissNotice = useCallback(() => {
    stopSpeaking()
    setNoticeVisible(false)
  }, [])

  const resetDemo = useCallback(() => {
    stopSpeaking()
    setDemo(initialDemo)
    setBookings([])
    setMaintenance(seedMaintenance)
    setDraftState(emptyDraft)
    setNoticeVisible(false)
  }, [])

  const currentScore = useMemo(() => {
    if (demo.scoreOverride !== null) return demo.scoreOverride
    if (!demo.resultReady) return scenario.baselineScore
    return scenario.newScore
  }, [demo, scenario])

  const subsystems = useMemo<Subsystem[]>(() => {
    if (demo.scoreOverride !== null || !demo.resultReady || scenario.healthy) return baseSubsystems
    return baseSubsystems.map((s) =>
      s.label === scenario.affectedSubsystem
        ? { ...s, value: scenario.severity === 'critical' ? 58 : 72 }
        : s
    )
  }, [demo, scenario])

  const setDraft = useCallback((d: Partial<BookingDraft>) => {
    setDraftState((prev) => ({ ...prev, ...d }))
  }, [])

  const startBooking = useCallback(
    (editingId?: string) => {
      const existing = editingId ? bookings.find((b) => b.id === editingId) : undefined
      setDraftState(
        existing
          ? {
              editingId: existing.id,
              dealershipId: existing.dealershipId,
              dayId: existing.dayId,
              dayLabel: existing.dayLabel,
              time: existing.time,
              notes: existing.notes ?? '',
            }
          : emptyDraft
      )
    },
    [bookings]
  )

  const commitDraft = useCallback((): Booking | null => {
    const { editingId, dealershipId, dayId, dayLabel, time, notes } = draft
    if (!dealershipId || !dayId || !dayLabel || !time) return null

    if (editingId) {
      const current = bookings.find((b) => b.id === editingId)
      if (!current) return null
      const updated: Booking = { ...current, dealershipId, dayId, dayLabel, time, notes }
      setBookings((prev) => prev.map((b) => (b.id === editingId ? updated : b)))
      setDraftState(emptyDraft)
      return updated
    }

    const booking: Booking = {
      id: uid('bk'),
      scenarioId: demo.hasRecommendation ? scenario.id : 'healthy',
      service: demo.hasRecommendation
        ? scenario.recommendation.replace(/^Agendar (uma )?/i, '').replace(/\.$/, '')
        : 'Revisão preventiva',
      dealershipId,
      dayId,
      dayLabel,
      time,
      notes,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    }
    setBookings((prev) => [booking, ...prev])
    setDraftState(emptyDraft)
    return booking
  }, [draft, bookings, scenario, demo.hasRecommendation])

  const updateBooking = useCallback((id: string, patch: Partial<Booking>) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))
  }, [])

  const cancelBooking = useCallback((id: string) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)))
  }, [])

  const deleteBooking = useCallback((id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const completeBooking = useCallback(
    (id: string) => {
      const b = bookings.find((x) => x.id === id)
      if (!b || b.status !== 'scheduled') return
      const sc = scenarios[b.scenarioId] ?? scenario
      const dealer = dealerships.find((d) => d.id === b.dealershipId)
      const resolves = (!sc.healthy && b.scenarioId === demo.scenarioId) || !demo.hasRecommendation
      setBookings((prev) => prev.map((x) => (x.id === id ? { ...x, status: 'completed' } : x)))
      setMaintenance((prev) => [
        {
          id: uid('m'),
          date: todayLabel(),
          label: b.service.charAt(0).toUpperCase() + b.service.slice(1),
          system: sc.healthy ? 'Geral' : sc.affectedSubsystem ?? sc.system,
          network: 'official',
          dealership: dealer?.name ?? 'Rede Ford',
          scoreBefore: currentScore,
          scoreAfter: resolves ? 93 : currentScore,
        },
        ...prev,
      ])
      if (resolves) {
        setDemo((d) => ({ ...d, hasRecommendation: false, resultReady: true, scoreOverride: 93 }))
      }
    },
    [bookings, scenario, currentScore, demo.scenarioId, demo.hasRecommendation]
  )

  const addMaintenance = useCallback((r: Omit<MaintenanceRecord, 'id'>) => {
    setMaintenance((prev) => [{ ...r, id: uid('m') }, ...prev])
  }, [])

  const deleteMaintenance = useCallback((id: string) => {
    setMaintenance((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const simulateOffNetwork = useCallback(() => {
    stopSpeaking()
    const system = scenario.healthy ? 'Freios' : scenario.affectedSubsystem ?? scenario.system
    setMaintenance((prev) => [
      {
        id: uid('off'),
        date: todayLabel(),
        label: `Reparo — ${system}`,
        system,
        network: 'off',
        dealership: 'Oficina externa (detectado pelo Henry)',
        scoreBefore: currentScore,
        scoreAfter: 91,
      },
      ...prev,
    ])
    setDemo((d) => ({ ...d, hasRecommendation: false, resultReady: true, scoreOverride: 91 }))
    setNoticeVisible(false)
  }, [scenario, currentScore])

  const offCount = maintenance.filter((m) => m.network === 'off').length
  const officialCount = maintenance.length - offCount
  const sealActive = maintenance.length ? maintenance[0].network !== 'off' : true
  const officialPct = maintenance.length ? Math.round((officialCount / maintenance.length) * 100) : 100
  const permanentLoss = offCount * resaleConfig.offPenalty
  const resaleValue = resaleConfig.base + (sealActive ? resaleConfig.sealPremium : 0) - permanentLoss
  const resaleWithSeal = resaleConfig.base + resaleConfig.sealPremium
  const recoverable = sealActive ? 0 : resaleConfig.sealPremium

  const value: AppState = {
    hydrated,
    session,
    signIn,
    signOut,
    scenario,
    hasRecommendation: demo.hasRecommendation,
    resultReady: demo.resultReady,
    currentScore,
    subsystems,
    noticeVisible,
    dismissNotice,
    runScenario,
    resetDemo,
    speaking,
    voiceEnabled,
    toggleVoice,
    draft,
    setDraft,
    startBooking,
    commitDraft,
    bookings,
    updateBooking,
    cancelBooking,
    deleteBooking,
    completeBooking,
    maintenance,
    addMaintenance,
    deleteMaintenance,
    simulateOffNetwork,
    sealActive,
    officialCount,
    offCount,
    officialPct,
    resaleValue,
    resaleWithSeal,
    recoverable,
    permanentLoss,
    sealPremium: resaleConfig.sealPremium,
    permanentPenalty: resaleConfig.offPenalty,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
