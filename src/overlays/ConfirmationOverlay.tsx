import { useEffect, useState } from 'react'
import { Check, Car, Building2, MapPin, CalendarCheck, Send, ShieldCheck } from 'lucide-react'
import { useApp } from '../store'
import { Overlay } from '../components/Overlay'
import { HenryOrb } from '../components/HenryOrb'
import { Button, cx } from '../components/ui'
import { dealerships, driver } from '../data/vehicle'
import { speak } from '../voice'

const dayLabels: Record<string, string> = {
  today: 'Hoje · 15 de setembro',
  tomorrow: 'Amanhã · 16 de setembro',
  d18: 'Quinta · 18 de setembro',
  d19: 'Sexta · 19 de setembro',
}

function FlowNode({
  icon: Icon,
  label,
  lit,
  color,
}: {
  icon: typeof Car
  label: string
  lit: boolean
  color: string
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cx(
          'grid h-16 w-16 place-items-center rounded-2xl transition-all duration-500',
          lit ? 'scale-100' : 'scale-90 opacity-40'
        )}
        style={{
          background: lit ? `${color}26` : 'rgba(255,255,255,0.05)',
          boxShadow: lit ? `0 0 28px ${color}66` : 'none',
          border: `1px solid ${lit ? color + '80' : 'rgba(255,255,255,0.1)'}`,
        }}
      >
        <Icon size={26} style={{ color: lit ? color : 'rgba(255,255,255,0.5)' }} />
      </div>
      <span
        className={cx(
          'text-[11px] font-bold uppercase tracking-wider transition-colors',
          lit ? 'text-white' : 'text-white/40'
        )}
      >
        {label}
      </span>
    </div>
  )
}

function Connector({ active }: { active: boolean }) {
  return (
    <div className="relative mt-[-22px] h-1 flex-1 overflow-hidden rounded-full bg-white/10">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-ford-periwinkle transition-[width] duration-500"
        style={{
          width: active ? '100%' : '0%',
          boxShadow: '0 0 10px rgba(137,159,254,0.8)',
        }}
      />
    </div>
  )
}

export function ConfirmationOverlay() {
  const { scenario, booking, resetDemo, setFlowStep, setTab, speaking } = useApp()
  const dealership = dealerships.find((d) => d.id === booking.dealershipId)
  const [stage, setStage] = useState(0) // 0..3 nodes, 4 = report revealed

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1200),
      setTimeout(() => setStage(3), 1900),
      setTimeout(() => setStage(4), 2500),
      setTimeout(
        () =>
          speak(
            'Pronto, Pedro. Agendei o serviço e já enviei o diagnóstico completo para a concessionária. Você não precisa explicar nada quando chegar.'
          ),
        900
      ),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <Overlay className="max-w-4xl">
      <div className="glass-strong scroll-area max-h-[92vh] overflow-y-auto rounded-[32px] p-6 shadow-glass-lg animate-fade-in-scale sm:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* LEFT — success + booking */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative">
              <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-emerald-400/50" />
              <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_40px_rgba(22,163,74,0.6)]">
                <Check size={40} strokeWidth={3} className="text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Serviço agendado</h2>
              <p className="mt-1 text-white/60">Tudo pronto, {driver.name}.</p>
            </div>

            <div className="glass w-full rounded-3xl p-5 text-left">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-ford-navy to-ford-blue text-lg font-black">
                  F
                </span>
                <div>
                  <div className="text-base font-bold">{dealership?.name}</div>
                  <div className="flex items-center gap-1 text-xs text-white/50">
                    <MapPin size={12} className="text-ford-periwinkle" />
                    {dealership?.address}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ford-periwinkle/15">
                  <CalendarCheck size={22} className="text-ford-periwinkle" />
                </span>
                <div>
                  <div className="text-base font-bold">
                    {booking.dayId ? dayLabels[booking.dayId] : ''}
                  </div>
                  <div className="text-sm text-white/60">às {booking.time}</div>
                </div>
              </div>
            </div>

            <div className="glass w-full rounded-2xl p-4 text-left">
              <div className="mb-1 flex items-center gap-2 text-emerald-300">
                <Send size={16} />
                <span className="text-sm font-bold">
                  Seu diagnóstico Henry já foi enviado para a concessionária.
                </span>
              </div>
              <p className="text-sm leading-relaxed text-white/70">
                <span className="font-semibold text-white">Você não precisa explicar o problema.</span>{' '}
                Quando chegar, a equipe já terá acesso ao diagnóstico.
              </p>
            </div>
          </div>

          {/* RIGHT — report flow */}
          <div className="flex flex-col gap-5">
            <div className="glass rounded-3xl p-6">
              <div className="mb-6 flex items-center gap-2">
                <HenryOrb size={30} active speaking={speaking} />
                <h3 className="text-lg font-bold">Diagnóstico enviado</h3>
              </div>
              <div className="flex items-start justify-between gap-1">
                <FlowNode icon={Car} label="Veículo" lit={stage >= 1} color="#899FFE" />
                <Connector active={stage >= 2} />
                <FlowNode icon={ShieldCheck} label="Henry" lit={stage >= 2} color="#899FFE" />
                <Connector active={stage >= 3} />
                <FlowNode icon={Building2} label="Concessionária" lit={stage >= 3} color="#16A34A" />
              </div>
            </div>

            <div
              className={cx(
                'glass rounded-3xl p-6 transition-all duration-500',
                stage >= 4 ? 'opacity-100' : 'opacity-30'
              )}
            >
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60">
                Dados compartilhados
              </h4>
              <ul className="space-y-3">
                {scenario.sharedData.map((d, i) => (
                  <li
                    key={d}
                    className="flex items-center gap-3"
                    style={{
                      transition: 'all 0.4s ease',
                      transitionDelay: `${i * 90}ms`,
                      opacity: stage >= 4 ? 1 : 0,
                      transform: stage >= 4 ? 'translateX(0)' : 'translateX(-8px)',
                    }}
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-500/20">
                      <Check size={14} className="text-emerald-400" strokeWidth={3} />
                    </span>
                    <span className="text-sm font-medium text-white/85">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            className="flex-1"
            onClick={() => {
              setFlowStep('idle')
              setTab('home')
            }}
          >
            Concluir
          </Button>
          <Button variant="secondary" onClick={resetDemo}>
            Reiniciar demonstração
          </Button>
        </div>
      </div>
    </Overlay>
  )
}
