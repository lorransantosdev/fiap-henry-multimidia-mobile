import {
  Navigation,
  Music,
  Phone,
  Car,
  ChevronRight,
  AlertTriangle,
  Activity,
} from 'lucide-react'
import { useApp } from '../store'
import { driver, vehicle } from '../data/vehicle'
import { Button, HealthRing, cx } from '../components/ui'

const quickCards = [
  { id: 'nav', label: 'Navegação', sub: 'Rota para casa', icon: Navigation },
  { id: 'music', label: 'Música', sub: 'Spotify', icon: Music },
  { id: 'phone', label: 'Telefone', sub: 'Contatos', icon: Phone },
  { id: 'vehicle', label: 'Veículo', sub: 'Saúde do carro', icon: Car },
] as const

export function HomeScreen() {
  const { setTab, currentScore, hasRecommendation, openAlert, setDemoOpen, scenario } =
    useApp()

  return (
    <div className="scroll-area grid h-full grid-cols-1 gap-5 overflow-y-auto md:grid-cols-[1.4fr_1fr]">
      {/* LEFT column */}
      <div className="flex flex-col gap-5">
        {/* greeting */}
        <div className="animate-fade-in-up">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/40">
            {vehicle.model}
          </p>
          <h1 className="mt-1.5 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Olá, {driver.name}
          </h1>
          <p className="mt-1 text-lg text-white/55">Como podemos ajudar?</p>
        </div>

        {/* recommendation banner */}
        {hasRecommendation && (
          <button
            onClick={openAlert}
            className="press animate-fade-in-scale flex items-center gap-4 rounded-3xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-amber-400/5 p-4 text-left shadow-glass"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-500/25">
              <AlertTriangle className="text-amber-300" size={24} />
            </span>
            <div className="flex-1">
              <div className="text-base font-bold text-amber-100">
                Henry recomenda uma inspeção
              </div>
              <div className="text-sm text-amber-100/70">
                {scenario.system} · Prioridade {scenario.priority}
              </div>
            </div>
            <ChevronRight className="text-amber-200/70" />
          </button>
        )}

        {/* quick cards */}
        <div className="grid grid-cols-2 gap-4">
          {quickCards.map((c, i) => {
            const Icon = c.icon
            return (
              <button
                key={c.id}
                onClick={() => {
                  if (c.id === 'vehicle') setTab('vehicle')
                  else if (c.id === 'nav') setTab('nav')
                  else if (c.id === 'music') setTab('music')
                }}
                className="press glass flex items-center gap-4 rounded-3xl p-5 text-left animate-fade-in-up"
                style={{ animationDelay: `${80 + i * 60}ms`, opacity: 0 }}
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/8">
                  <Icon size={24} className="text-ford-periwinkle" />
                </span>
                <div>
                  <div className="text-lg font-bold leading-tight">{c.label}</div>
                  <div className="text-sm text-white/45">{c.sub}</div>
                </div>
              </button>
            )
          })}
        </div>

        {/* simulate event — discreet */}
        <button
          onClick={() => setDemoOpen(true)}
          className="press mt-auto inline-flex w-fit items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/55 hover:text-white/85"
        >
          <Activity size={16} />
          Simular evento
        </button>
      </div>

      {/* RIGHT column — health hero */}
      <div
        className="glass relative flex flex-col items-center justify-center gap-5 overflow-hidden rounded-3xl p-6 animate-fade-in-scale"
        style={{ animationDelay: '120ms', opacity: 0 }}
      >
        <div className="text-sm font-medium uppercase tracking-[0.18em] text-white/40">
          Saúde do veículo
        </div>
        <HealthRing value={currentScore} size={210} label="Health Score" />
        <div
          className={cx(
            'rounded-full px-4 py-1.5 text-sm font-medium',
            hasRecommendation
              ? 'bg-amber-500/15 text-amber-200'
              : 'bg-emerald-500/15 text-emerald-300'
          )}
        >
          {hasRecommendation ? 'Inspeção recomendada' : 'Monitoramento ativo'}
        </div>
        <Button block variant="secondary" size="md" onClick={() => setTab('vehicle')}>
          <Car size={20} />
          Ver saúde do veículo
        </Button>
      </div>
    </div>
  )
}
