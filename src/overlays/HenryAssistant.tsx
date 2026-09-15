import { useEffect } from 'react'
import { Calendar, MessageSquare, X, Activity } from 'lucide-react'
import { useApp } from '../store'
import { HenryOrb } from '../components/HenryOrb'
import { Button } from '../components/ui'
import { VoiceReply } from '../components/VoiceReply'
import { RX_AFFIRMATIVE, RX_NEGATIVE, RX_SCHEDULE } from './HenryNotice'
import { speak } from '../voice'

/** A single animated waveform to suggest the assistant is "listening/speaking" */
function Waveform({ alert }: { alert: boolean }) {
  const bars = [10, 18, 28, 20, 34, 22, 14, 26, 16]
  const color = alert ? '#F59E0B' : '#899FFE'
  return (
    <div className="flex h-9 items-end gap-1">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-1.5 rounded-full"
          style={{
            height: h,
            background: color,
            animation: 'breathe 1.4s ease-in-out infinite',
            animationDelay: `${i * 0.09}s`,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  )
}

export function HenryAssistant() {
  const {
    henryOpen,
    setHenryOpen,
    hasRecommendation,
    openAlert,
    setFlowStep,
    scenario,
    speaking,
  } = useApp()

  // Henry greets and speaks the moment the assistant opens.
  useEffect(() => {
    if (!henryOpen) return
    const line = hasRecommendation
      ? `Olá Pedro. ${scenario.voiceLine}`
      : `Olá Pedro. Estou monitorando o seu Ford de forma contínua e, no momento, está tudo dentro do esperado.`
    const t = setTimeout(() => speak(line), 300)
    return () => clearTimeout(t)
  }, [henryOpen, hasRecommendation, scenario])

  if (!henryOpen) return null

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-5">
      <div
        className="absolute inset-0 bg-[#02061f]/70 backdrop-blur-md animate-fade-in"
        onClick={() => setHenryOpen(false)}
      />
      <div className="relative z-10 w-full max-w-lg">
        <div className="glass-strong rounded-[32px] p-7 shadow-glass-lg animate-slide-up sm:animate-fade-in-scale">
          <div className="flex items-start gap-4">
            <HenryOrb size={72} active alert={hasRecommendation} speaking={speaking} />
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-ford-periwinkle">
                  Henry · Assistente
                </span>
                <button
                  onClick={() => setHenryOpen(false)}
                  className="press grid h-8 w-8 place-items-center rounded-full bg-white/8 text-white/70 hover:bg-white/15"
                >
                  <X size={17} />
                </button>
              </div>
              <Waveform alert={hasRecommendation} />
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xl font-bold leading-snug">Olá, sou o Henry.</p>
            {hasRecommendation ? (
              <p className="mt-1.5 text-[15px] leading-relaxed text-white/75">
                {scenario.voiceLine}
              </p>
            ) : (
              <p className="mt-1.5 text-[15px] leading-relaxed text-white/75">
                Estou monitorando seu {scenario.system.toLowerCase() === 'diagnóstico geral' ? 'veículo' : 'Ford'} de forma contínua.
                No momento, está tudo dentro do esperado.
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {hasRecommendation ? (
              <>
                <Button
                  block
                  onClick={() => {
                    setHenryOpen(false)
                    openAlert()
                  }}
                >
                  <MessageSquare size={20} />
                  Sim, explicar
                </Button>
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    variant="secondary"
                    onClick={() => {
                      setHenryOpen(false)
                      setFlowStep('dealership')
                    }}
                  >
                    <Calendar size={18} />
                    Agendar serviço
                  </Button>
                  <Button variant="secondary" onClick={() => setHenryOpen(false)}>
                    Agora não
                  </Button>
                </div>
                <div className="mt-1 border-t border-white/8 pt-3">
                  <VoiceReply
                    intents={[
                      { test: RX_NEGATIVE, run: () => setHenryOpen(false) },
                      {
                        test: RX_SCHEDULE,
                        run: () => {
                          setHenryOpen(false)
                          setFlowStep('dealership')
                        },
                      },
                      {
                        test: RX_AFFIRMATIVE,
                        run: () => {
                          setHenryOpen(false)
                          openAlert()
                        },
                      },
                    ]}
                  />
                </div>
              </>
            ) : (
              <Button block variant="secondary" onClick={() => setHenryOpen(false)}>
                <Activity size={18} />
                Entendi
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
