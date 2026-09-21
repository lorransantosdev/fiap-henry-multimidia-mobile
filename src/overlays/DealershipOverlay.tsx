import { useEffect } from 'react'
import { MapPin, Star, ArrowLeft, Clock, Check } from 'lucide-react'
import { useApp } from '../store'
import { Overlay } from '../components/Overlay'
import { Button, cx } from '../components/ui'
import { VoiceReply } from '../components/VoiceReply'
import { dealerships } from '../data/vehicle'
import { speak } from '../voice'

export function DealershipOverlay() {
  const { setFlowStep, booking, setBooking } = useApp()

  useEffect(() => {
    const t = setTimeout(
      () => speak('Onde prefere agendar? Recomendo a Ford Center São Paulo. Pode ser?'),
      400
    )
    return () => clearTimeout(t)
  }, [])

  const chooseAndGo = (id: string) => {
    setBooking({ dealershipId: id })
    setTimeout(() => setFlowStep('scheduling'), 120)
  }

  const handleVoice = (text: string) => {
    if (/\b(norte)\b/.test(text)) return chooseAndGo('norte')
    if (/\b(leste)\b/.test(text)) return chooseAndGo('leste')
    if (
      /\b(s[aã]o paulo|center|primeir|mais pr[oó]xim|essa|esse|sim|pode|isso|ok|beleza)/.test(
        text
      )
    )
      return chooseAndGo('sp')
    if (booking.dealershipId) return chooseAndGo(booking.dealershipId)
  }

  return (
    <Overlay className="max-w-3xl">
      <div className="glass-strong scroll-area max-h-[92vh] overflow-y-auto rounded-[32px] p-6 shadow-glass-lg animate-fade-in-scale sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <button
            onClick={() => setFlowStep('alert')}
            className="press grid h-10 w-10 place-items-center rounded-full bg-white/8 hover:bg-white/15"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Escolha onde cuidar do seu Ford
            </h2>
            <p className="text-sm text-white/55">Concessionárias da rede Ford perto de você</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {dealerships.map((d, i) => {
            const selected = booking.dealershipId === d.id
            return (
              <button
                key={d.id}
                onClick={() => setBooking({ dealershipId: d.id })}
                className={cx(
                  'press flex flex-col gap-4 rounded-3xl border p-5 text-left shadow-glass animate-fade-in-up sm:flex-row sm:items-center',
                  selected
                    ? 'border-ford-periwinkle/60 bg-ford-periwinkle/12 ring-1 ring-ford-periwinkle/40'
                    : 'border-white/10 bg-white/[0.04] hover:border-white/25'
                )}
                style={{ animationDelay: `${i * 70}ms`, opacity: 0 }}
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-ford-navy to-ford-blue text-xl font-black">
                  F
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{d.name}</span>
                    {selected && (
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-ford-periwinkle">
                        <Check size={13} className="text-ford-navy" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-ford-periwinkle" />
                      {d.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      {d.rating.toFixed(1)} · {d.reviews.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-white/40">{d.address}</div>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/12 px-4 py-2.5 text-emerald-300">
                  <Clock size={16} />
                  <div>
                    <div className="text-[11px] text-emerald-200/70">Primeiro horário</div>
                    <div className="text-sm font-bold">{d.firstSlot}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <VoiceReply
            intents={[{ test: /.+/, run: handleVoice }]}
            hint="Diga “Ford Center”, “Norte” ou “Leste”"
            className="sm:mr-auto"
          />
          <Button
            disabled={!booking.dealershipId}
            onClick={() => setFlowStep('scheduling')}
            className="w-full sm:w-auto"
          >
            Selecionar
          </Button>
        </div>
      </div>
    </Overlay>
  )
}
