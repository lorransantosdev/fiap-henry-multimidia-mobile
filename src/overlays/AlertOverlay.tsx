import { useEffect, useState } from 'react'
import {
  Calendar,
  ChevronDown,
  Clock,
  X,
  Gauge,
  Lightbulb,
  ShieldAlert,
  Volume2,
  RotateCcw,
} from 'lucide-react'
import { useApp } from '../store'
import { Overlay } from '../components/Overlay'
import { HenryOrb } from '../components/HenryOrb'
import { Button, HealthRing, PriorityPill, cx } from '../components/ui'
import { VoiceReply } from '../components/VoiceReply'
import { RX_AFFIRMATIVE, RX_NEGATIVE, RX_SCHEDULE } from './HenryNotice'
import { speak } from '../voice'

function SpeakingDots() {
  return (
    <span className="inline-flex items-end gap-0.5">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-1 rounded-full bg-ford-periwinkle"
          style={{ height: 6 + (i % 2) * 8, animation: 'breathe 1s ease-in-out infinite', animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </span>
  )
}

function ProbabilityBar({ value, accent }: { value: number; accent: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-medium text-white/60">Probabilidade</span>
        <span className="text-2xl font-extrabold" style={{ color: accent }}>
          {value}%
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            background: accent,
            boxShadow: `0 0 12px ${accent}99`,
            transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>
    </div>
  )
}

export function AlertOverlay() {
  const { scenario, setFlowStep, dismissAlert, speaking, voiceEnabled } = useApp()
  const [showDetails, setShowDetails] = useState(false)

  // Henry proactively speaks the recommendation the moment the alert appears.
  useEffect(() => {
    const t = setTimeout(() => speak(scenario.spoken), 350)
    return () => clearTimeout(t)
  }, [scenario])

  const intents = [
    { test: RX_NEGATIVE, run: dismissAlert },
    { test: RX_SCHEDULE, run: () => setFlowStep('dealership') },
    { test: RX_AFFIRMATIVE, run: () => setFlowStep('dealership') },
  ]

  return (
    <Overlay className="max-w-5xl" onBackdrop={dismissAlert}>
      <div className="glass-strong scroll-area max-h-[92vh] overflow-y-auto rounded-[32px] shadow-glass-lg animate-fade-in-scale">
        {/* header */}
        <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-white/10 bg-[#04093a]/70 px-6 py-5 backdrop-blur-xl sm:px-8">
          <HenryOrb size={56} alert speaking={speaking} active />
          <div className="flex-1">
            <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
              {scenario.headline}
            </h2>
            {speaking ? (
              <p className="flex items-center gap-2 text-sm font-medium text-ford-periwinkle">
                <SpeakingDots /> Henry está explicando…
              </p>
            ) : (
              <p className="text-sm text-white/60">{scenario.subtitle}</p>
            )}
          </div>
          {voiceEnabled && (
            <button
              onClick={() => speak(scenario.spoken)}
              className="press hidden h-10 items-center gap-2 rounded-full bg-white/8 px-4 text-sm font-semibold text-white/80 hover:bg-white/15 sm:flex"
              aria-label="Ouvir novamente"
            >
              {speaking ? <Volume2 size={17} /> : <RotateCcw size={16} />}
              {speaking ? 'Ouvindo' : 'Ouvir'}
            </button>
          )}
          <button
            onClick={dismissAlert}
            className="press grid h-10 w-10 place-items-center rounded-full bg-white/8 text-white/70 hover:bg-white/15"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 sm:p-8 md:grid-cols-[280px_1fr]">
          {/* LEFT — score + probability */}
          <div className="flex flex-col gap-5">
            <div className="glass flex flex-col items-center gap-3 rounded-3xl p-5">
              <HealthRing
                value={scenario.newScore}
                from={scenario.baselineScore}
                size={168}
                color={scenario.accent}
              />
              <div
                className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
                style={{ background: `${scenario.accent}22`, color: scenario.accent }}
              >
                <ShieldAlert size={16} />
                Recomendamos uma inspeção
              </div>
            </div>

            <div className="glass rounded-3xl p-5">
              <div className="mb-3 flex items-center gap-2 text-white/70">
                <Gauge size={18} className="text-ford-periwinkle" />
                <span className="text-sm font-semibold">Sinal identificado</span>
              </div>
              <div className="mb-4 text-lg font-bold leading-snug">
                {scenario.system === 'Sistema de frenagem'
                  ? 'Possível desgaste do sistema de frenagem'
                  : scenario.system === 'Bateria'
                  ? 'Possível degradação da bateria'
                  : 'Variação na condição dos pneus'}
              </div>
              <ProbabilityBar value={scenario.probability} accent={scenario.accent} />
            </div>
          </div>

          {/* RIGHT — meaning + recommendation */}
          <div className="flex flex-col gap-5">
            {/* what it means */}
            <div className="glass rounded-3xl p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-ford-periwinkle/20">
                  <Lightbulb size={17} className="text-ford-periwinkle" />
                </span>
                <h3 className="text-lg font-bold">O que isso significa?</h3>
              </div>
              <div className="space-y-3">
                <p className="text-[15px] leading-relaxed text-white/80">
                  Os dados indicam sinais compatíveis com desgaste acima do esperado.
                </p>
                {scenario.meaning.map((p, i) => (
                  <p key={i} className="text-[15px] leading-relaxed text-white/80">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* recommendation */}
            <div className="rounded-3xl border border-ford-periwinkle/25 bg-gradient-to-br from-ford-periwinkle/12 to-ford-blue/5 p-6">
              <div className="mb-4 flex items-center gap-2">
                <HenryOrb size={34} active />
                <h3 className="text-lg font-bold">Recomendação Henry</h3>
              </div>
              <p className="mb-4 text-lg font-semibold text-white">
                {scenario.recommendation}
              </p>
              <div className="mb-4 flex flex-wrap gap-3">
                <div className="glass flex items-center gap-2 rounded-2xl px-4 py-2.5">
                  <Clock size={18} className="text-ford-periwinkle" />
                  <div>
                    <div className="text-xs text-white/50">Tempo estimado</div>
                    <div className="text-sm font-bold">{scenario.estimatedTime}</div>
                  </div>
                </div>
                <div className="glass flex items-center rounded-2xl px-4 py-2.5">
                  <PriorityPill priority={scenario.priority} />
                </div>
              </div>
              <p className="rounded-2xl bg-white/5 px-4 py-3 text-sm leading-relaxed text-white/75">
                {scenario.drivingNote}
              </p>

              {/* expandable details */}
              <button
                onClick={() => setShowDetails((v) => !v)}
                className="press mt-3 flex items-center gap-1.5 text-sm font-semibold text-ford-periwinkle"
              >
                Ver detalhes
                <ChevronDown
                  size={16}
                  className={cx('transition-transform', showDetails && 'rotate-180')}
                />
              </button>
              {showDetails && (
                <ul className="mt-3 space-y-2 border-t border-white/10 pt-3 text-sm text-white/70 animate-fade-in">
                  {scenario.sharedData.map((d) => (
                    <li key={d} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-ford-periwinkle" />
                      {d}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="sticky bottom-0 flex flex-col gap-3 border-t border-white/10 bg-[#04093a]/70 px-6 py-5 backdrop-blur-xl sm:flex-row sm:items-center sm:px-8">
          <VoiceReply intents={intents} className="sm:mr-auto" />
          <Button className="flex-1 sm:flex-none" onClick={() => setFlowStep('dealership')}>
            <Calendar size={22} />
            Agendar serviço Ford
          </Button>
          <Button variant="secondary" onClick={dismissAlert}>
            Agora não
          </Button>
        </div>
      </div>
    </Overlay>
  )
}
