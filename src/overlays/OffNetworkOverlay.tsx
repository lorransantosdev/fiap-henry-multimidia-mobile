import { useEffect } from 'react'
import { Sparkles, Wrench, TrendingUp, Calendar, Check } from 'lucide-react'
import { useApp } from '../store'
import { Overlay } from '../components/Overlay'
import { HenryOrb } from '../components/HenryOrb'
import { MaintenanceSeal } from '../components/MaintenanceSeal'
import { Button } from '../components/ui'
import { formatBRL } from '../data/maintenance'
import { speak } from '../voice'

export function OffNetworkOverlay() {
  const {
    offNetworkOpen,
    closeOffNetwork,
    speaking,
    recoverable,
    permanentPenalty,
    setFlowStep,
  } = useApp()

  useEffect(() => {
    if (!offNetworkOpen) return
    const t = setTimeout(
      () =>
        speak(
          'Boa, Pedro! A saúde do seu Ford melhorou. Registrei o serviço no seu histórico. Quando quiser, a próxima manutenção na rede Ford reativa o Selo Oficial.'
        ),
      400
    )
    return () => clearTimeout(t)
  }, [offNetworkOpen])

  if (!offNetworkOpen) return null

  return (
    <Overlay className="max-w-2xl" onBackdrop={closeOffNetwork}>
      <div className="glass-strong scroll-area max-h-[92vh] overflow-y-auto rounded-[32px] shadow-glass-lg animate-fade-in-scale">
        {/* header — celebratory, not punitive */}
        <div className="flex items-center gap-4 border-b border-white/10 p-6 sm:p-7">
          <HenryOrb size={54} speaking={speaking} active />
          <div>
            <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight sm:text-2xl">
              <Sparkles size={20} className="text-emerald-400" />
              A saúde do seu Ford melhorou
            </h2>
            <p className="text-sm text-white/60">
              Registramos o serviço no seu histórico para mantê-lo completo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-6 sm:p-7 md:grid-cols-2">
          {/* what happened — neutral, reassuring */}
          <div className="glass rounded-3xl p-5">
            <div className="mb-3 flex items-center gap-2 text-white/70">
              <Wrench size={18} className="text-ford-periwinkle" />
              <span className="text-sm font-semibold">O que registramos</span>
            </div>
            <p className="text-[15px] leading-relaxed text-white/80">
              Notamos que o Health Score do seu Ford melhorou. Como o serviço foi feito fora da
              rede, registramos aqui — assim seu histórico fica sempre completo.{' '}
              <span className="font-semibold text-white">Sem problema algum.</span>
            </p>
            <div className="mt-4 flex items-center gap-3">
              <MaintenanceSeal active={false} size={72} />
              <div>
                <div className="text-sm font-bold text-white/85">Selo pausado</div>
                <div className="text-xs text-white/55">
                  Recuperável na próxima manutenção na rede Ford.
                </div>
              </div>
            </div>
          </div>

          {/* opportunity — gain framing, not loss */}
          <div className="rounded-3xl border border-status-blue/30 bg-status-blue/[0.09] p-5">
            <div className="mb-3 flex items-center gap-2 text-ford-periwinkle">
              <TrendingUp size={18} />
              <span className="text-sm font-semibold">Como recuperar o Selo</span>
            </div>
            <p className="text-[15px] leading-relaxed text-white/80">
              Fazendo a próxima manutenção na rede Ford, você reativa o{' '}
              <span className="font-semibold text-white">Selo Oficial</span> e agrega ao valor de
              revenda:
            </p>
            <div className="mt-3 rounded-2xl bg-status-blue/12 px-4 py-3 text-center">
              <div className="text-xs uppercase tracking-wider text-white/55">
                Valor a recuperar
              </div>
              <div className="text-2xl font-extrabold text-ford-periwinkle">
                +{formatBRL(recoverable)}
              </div>
            </div>
            <div className="mt-2 text-center text-[11px] text-white/45">
              Apenas {formatBRL(permanentPenalty)} ficam registrados no histórico e não voltam.
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-white/60">
              <Check size={14} className="text-emerald-400" />
              Você escolhe onde reparar. O Henry só mantém seu histórico em dia.
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="flex flex-col gap-3 border-t border-white/10 p-6 sm:flex-row sm:p-7">
          <Button variant="secondary" className="flex-1" onClick={closeOffNetwork}>
            Agora não
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              closeOffNetwork()
              setFlowStep('dealership')
            }}
          >
            <Calendar size={20} />
            Agendar próxima na Ford
          </Button>
        </div>
      </div>
    </Overlay>
  )
}
