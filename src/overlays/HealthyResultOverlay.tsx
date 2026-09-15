import { useEffect } from 'react'
import { ShieldCheck, Check } from 'lucide-react'
import { useApp } from '../store'
import { Overlay } from '../components/Overlay'
import { HenryOrb } from '../components/HenryOrb'
import { Button, HealthRing } from '../components/ui'
import { baseSubsystems } from '../data/vehicle'
import { speak } from '../voice'

export function HealthyResultOverlay() {
  const { scenario, dismissAlert, setTab, speaking } = useApp()

  useEffect(() => {
    const t = setTimeout(() => speak(scenario.spoken), 350)
    return () => clearTimeout(t)
  }, [scenario])

  return (
    <Overlay className="max-w-xl" onBackdrop={dismissAlert}>
      <div className="glass-strong flex flex-col items-center gap-5 rounded-[32px] p-8 text-center shadow-glass-lg animate-fade-in-scale sm:p-10">
        <HenryOrb size={64} active speaking={speaking} />
        <HealthRing value={scenario.newScore} size={190} color="#16A34A" label="Health Score" />
        <div className="flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-emerald-300">
          <ShieldCheck size={18} />
          <span className="font-semibold">Seu veículo está saudável</span>
        </div>
        <p className="max-w-md leading-relaxed text-white/70">{scenario.meaning[0]}</p>
        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-5">
          {baseSubsystems.map((s) => (
            <div key={s.label} className="glass rounded-2xl px-2 py-3">
              <Check size={16} className="mx-auto mb-1 text-emerald-400" />
              <div className="text-xs text-white/55">{s.label}</div>
              <div className="text-sm font-bold text-emerald-300">{s.value}</div>
            </div>
          ))}
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Button
            className="flex-1"
            variant="secondary"
            onClick={() => {
              dismissAlert()
              setTab('vehicle')
            }}
          >
            Ver saúde completa
          </Button>
          <Button className="flex-1" onClick={dismissAlert}>
            Entendi
          </Button>
        </div>
      </div>
    </Overlay>
  )
}
