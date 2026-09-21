import { useEffect } from 'react'
import { X, MessageSquare, ShieldCheck } from 'lucide-react'
import { useApp } from '../store'
import { HenryOrb } from '../components/HenryOrb'
import { Button } from '../components/ui'
import { VoiceReply } from '../components/VoiceReply'
import { speak } from '../voice'

// Shared pt-BR intent matchers for answering Henry by voice.
// NOTE: use stems WITHOUT a trailing \b — e.g. \bagend matches "agendar",
// "agenda", "agende" (a trailing \b would fail on the letters after the stem).
export const RX_NEGATIVE = /\b(n[aã]o|nao|depois|deix|mais tarde|negativ|cancel)/
export const RX_SCHEDULE = /\b(agend|marc)/
export const RX_AFFIRMATIVE =
  /\b(sim|claro|pode|quero|explic|conta|mostra|manda|isso|beleza|ok|okay|positiv|vamos|bora|entend)/

/**
 * Henry's proactive notification. Appears the moment an event is detected —
 * Henry says he noticed something and asks if the driver wants an explanation.
 * Non-blocking toast: the rest of the multimedia stays usable behind it.
 */
export function HenryNotice() {
  const {
    henryNotice,
    hasRecommendation,
    scenario,
    speaking,
    openAlert,
    dismissNotice,
    setFlowStep,
  } = useApp()

  useEffect(() => {
    if (!henryNotice) return
    const line = hasRecommendation
      ? `Pedro, percebi um sinal no ${scenario.system.toLowerCase()}. Quer que eu explique?`
      : scenario.spoken
    const t = setTimeout(() => speak(line), 400)
    return () => clearTimeout(t)
  }, [henryNotice, hasRecommendation, scenario])

  if (!henryNotice) return null

  const accent = hasRecommendation ? scenario.accent : '#16A34A'

  const intents = hasRecommendation
    ? [
        { test: RX_NEGATIVE, run: dismissNotice },
        { test: RX_SCHEDULE, run: () => { dismissNotice(); setFlowStep('dealership') } },
        { test: RX_AFFIRMATIVE, run: openAlert },
      ]
    : [
        { test: RX_AFFIRMATIVE, run: () => { dismissNotice(); setFlowStep('healthy-result') } },
        { test: RX_NEGATIVE, run: dismissNotice },
      ]

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[64px] z-40 flex justify-center px-4 sm:top-[72px]">
      <div
        className="pointer-events-auto w-full max-w-xl overflow-hidden rounded-3xl shadow-glass-lg animate-fade-in-down"
        style={{
          background: 'rgba(6, 12, 46, 0.82)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(137,159,254,0.16)',
        }}
      >
        <div className="h-1 w-full" style={{ background: accent }} />

        <div className="flex items-center gap-4 px-4 pt-4 sm:px-5 sm:pt-5">
          <HenryOrb size={54} alert={hasRecommendation} speaking={speaking} active />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-ford-periwinkle">
                Henry
              </span>
              {speaking && (
                <span className="flex items-end gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-ford-periwinkle"
                      style={{
                        height: 5 + (i % 2) * 6,
                        animation: 'breathe 1s ease-in-out infinite',
                        animationDelay: `${i * 0.12}s`,
                      }}
                    />
                  ))}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[15px] font-semibold leading-snug sm:text-base">
              {hasRecommendation
                ? `Percebi um sinal no ${scenario.system.toLowerCase()}.`
                : 'Seu Ford está com a saúde em dia.'}
            </p>
            <p className="text-sm text-white/55">
              {hasRecommendation
                ? 'Quer que eu te explique o que encontrei?'
                : 'Nenhuma anomalia identificada no momento.'}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {hasRecommendation ? (
              <>
                <Button size="sm" onClick={openAlert}>
                  <MessageSquare size={16} />
                  Sim, explicar
                </Button>
                <button
                  onClick={dismissNotice}
                  className="press hidden h-11 items-center rounded-2xl px-4 text-sm font-semibold text-white/60 hover:bg-white/8 hover:text-white/90 sm:flex"
                >
                  Agora não
                </button>
                <button
                  onClick={dismissNotice}
                  className="press grid h-9 w-9 place-items-center rounded-full text-white/60 hover:bg-white/10 sm:hidden"
                  aria-label="Fechar"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    dismissNotice()
                    setFlowStep('healthy-result')
                  }}
                >
                  <ShieldCheck size={16} />
                  Ver resumo
                </Button>
                <button
                  onClick={dismissNotice}
                  className="press grid h-9 w-9 place-items-center rounded-full text-white/60 hover:bg-white/10"
                  aria-label="Fechar"
                >
                  <X size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* voice reply */}
        <div className="border-t border-white/8 px-4 py-3 sm:px-5">
          <VoiceReply intents={intents} />
        </div>
      </div>
    </div>
  )
}
