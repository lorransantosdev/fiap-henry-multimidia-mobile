import { AppProvider, useApp } from './store'
import { Background } from './components/Background'
import { StatusBar } from './components/StatusBar'
import { BottomNav } from './components/BottomNav'
import { DemoLauncher, DemoPanel } from './components/DemoPanel'
import { HomeScreen } from './screens/HomeScreen'
import { VehicleScreen } from './screens/VehicleScreen'
import { NavScreen, MusicScreen } from './screens/PlaceholderScreen'
import { AlertOverlay } from './overlays/AlertOverlay'
import { HealthyResultOverlay } from './overlays/HealthyResultOverlay'
import { DealershipOverlay } from './overlays/DealershipOverlay'
import { SchedulingOverlay } from './overlays/SchedulingOverlay'
import { ConfirmationOverlay } from './overlays/ConfirmationOverlay'
import { HenryAssistant } from './overlays/HenryAssistant'
import { HenryNotice } from './overlays/HenryNotice'

function Screens() {
  const { tab } = useApp()
  return (
    <div key={tab} className="h-full animate-fade-in">
      {tab === 'home' && <HomeScreen />}
      {tab === 'vehicle' && <VehicleScreen />}
      {tab === 'nav' && <NavScreen />}
      {tab === 'music' && <MusicScreen />}
    </div>
  )
}

function FlowManager() {
  const { flowStep } = useApp()
  return (
    <>
      {flowStep === 'alert' && <AlertOverlay />}
      {flowStep === 'healthy-result' && <HealthyResultOverlay />}
      {flowStep === 'dealership' && <DealershipOverlay />}
      {flowStep === 'scheduling' && <SchedulingOverlay />}
      {flowStep === 'confirmation' && <ConfirmationOverlay />}
    </>
  )
}

function Shell() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#00072e]">
      <Background />

      {/* Infotainment surface */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col px-4 py-3 sm:px-6 sm:py-4">
        <header className="shrink-0 pb-3">
          <StatusBar />
        </header>

        <main className="min-h-0 flex-1 pb-3">
          <Screens />
        </main>

        <footer className="shrink-0">
          <BottomNav />
        </footer>
      </div>

      {/* Presentation tooling */}
      <DemoLauncher />
      <DemoPanel />

      {/* Proactive notification, flows & assistant */}
      <HenryNotice />
      <FlowManager />
      <HenryAssistant />

      {/* Portrait hint */}
      <PortraitHint />
    </div>
  )
}

function PortraitHint() {
  return (
    <div className="absolute inset-0 z-[80] hidden flex-col items-center justify-center gap-4 bg-[#02061f]/95 p-8 text-center portrait:flex sm:portrait:hidden">
      <div className="grid h-16 w-16 animate-spin-slow place-items-center rounded-2xl border-2 border-ford-periwinkle/50">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#899FFE" strokeWidth="2">
          <rect x="3" y="6" width="18" height="12" rx="2" />
        </svg>
      </div>
      <div>
        <p className="text-lg font-bold">Gire para o modo paisagem</p>
        <p className="mt-1 text-sm text-white/60">
          O Henry Multimedia foi projetado para telas landscape.
        </p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
