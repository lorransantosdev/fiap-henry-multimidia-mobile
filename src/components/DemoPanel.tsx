import { SlidersHorizontal, X, Play, RotateCcw, Wrench } from 'lucide-react'
import { useApp } from '../store'
import { scenarioOrder, scenarios } from '../data/scenarios'
import { cx } from './ui'

export function DemoLauncher() {
  const { demoOpen, setDemoOpen } = useApp()
  if (demoOpen) return null
  return (
    <button
      onClick={() => setDemoOpen(true)}
      className="press glass-strong absolute right-4 top-4 z-30 flex items-center gap-2 rounded-full border border-dashed border-ford-periwinkle/50 px-4 py-2 text-sm font-semibold text-ford-periwinkle shadow-glass"
    >
      <SlidersHorizontal size={16} />
      Demo
    </button>
  )
}

export function DemoPanel() {
  const {
    demoOpen,
    setDemoOpen,
    runScenario,
    resetDemo,
    scenarioId,
    resultReady,
    simulateOffNetwork,
  } = useApp()
  if (!demoOpen) return null

  return (
    <div className="absolute inset-0 z-[60] flex items-start justify-end p-4">
      <div className="absolute inset-0" onClick={() => setDemoOpen(false)} />
      <div className="relative w-full max-w-xs animate-slide-in-right">
        <div className="rounded-3xl border border-dashed border-ford-periwinkle/40 bg-[#060f45]/90 p-5 shadow-glass-lg backdrop-blur-xl">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ford-periwinkle">
              Modo Apresentação
            </span>
            <button
              onClick={() => setDemoOpen(false)}
              className="press grid h-8 w-8 place-items-center rounded-full bg-white/8 text-white/70 hover:bg-white/15"
            >
              <X size={16} />
            </button>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-white/50">
            Ferramenta de demonstração. Selecione um cenário para simular o que o motorista veria.
          </p>

          <div className="flex flex-col gap-2.5">
            {scenarioOrder.map((id) => {
              const s = scenarios[id]
              const Icon = s.icon
              const active = scenarioId === id && resultReady
              return (
                <button
                  key={id}
                  onClick={() => runScenario(id)}
                  className={cx(
                    'press flex items-center gap-3 rounded-2xl border p-3 text-left transition-all',
                    active
                      ? 'border-ford-periwinkle/60 bg-ford-periwinkle/12'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                  )}
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                    style={{ background: `${s.accent}22` }}
                  >
                    <Icon size={20} style={{ color: s.accent }} />
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{s.demoLabel}</div>
                    <div className="text-xs text-white/45">
                      {s.healthy ? 'Sem anomalias' : `Score ${s.newScore} · ${s.priority}`}
                    </div>
                  </div>
                  <Play size={16} className="text-white/40" />
                </button>
              )
            })}
          </div>

          {/* Off-network repair (seal) */}
          <div className="mt-4 border-t border-white/8 pt-4">
            <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300/80">
              Selo de manutenção
            </span>
            <button
              onClick={simulateOffNetwork}
              className="press flex w-full items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-500/8 p-3 text-left transition-all hover:border-amber-400/50"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/20">
                <Wrench size={20} className="text-amber-300" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-bold">Reparo fora da rede</div>
                <div className="text-xs text-white/45">Detecta melhora sem passar na Ford</div>
              </div>
              <Play size={16} className="text-white/40" />
            </button>
          </div>

          <button
            onClick={resetDemo}
            className="press mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] py-2.5 text-sm font-medium text-white/60 hover:text-white/90"
          >
            <RotateCcw size={15} />
            Reiniciar demonstração
          </button>
        </div>
      </div>
    </div>
  )
}
