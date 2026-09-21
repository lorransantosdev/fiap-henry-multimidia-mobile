import { useEffect } from 'react'
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react'
import { useApp } from '../store'
import { Overlay } from '../components/Overlay'
import { Button, cx } from '../components/ui'
import { VoiceReply } from '../components/VoiceReply'
import { dayOptions, dealerships, timeSlots } from '../data/vehicle'
import { speak } from '../voice'

const daySpoken: Record<string, string> = {
  today: 'hoje',
  tomorrow: 'amanhã',
  d18: 'quinta, dia 18',
  d19: 'sexta, dia 19',
}

/** Extract a day / time / confirmation from a pt-BR spoken phrase. */
function parseSchedule(s: string): {
  day?: string
  time?: string
  confirm: boolean
} {
  let day: string | undefined
  let time: string | undefined

  if (/\bhoje\b/.test(s)) day = 'today'
  else if (/\bamanh[aã]/.test(s)) day = 'tomorrow'
  else if (/\b(quinta|dezoito|18)\b/.test(s)) day = 'd18'
  else if (/\b(sexta|dezenove|19)\b/.test(s)) day = 'd19'

  if (/\b0?9[:h ]?40\b/.test(s) || (/\bnove\b/.test(s) && /\bquarenta\b/.test(s)))
    time = '09:40'
  else if (/\b11[:h ]?20\b/.test(s) || (/\bonze\b/.test(s) && /\bvinte\b/.test(s)))
    time = '11:20'
  else if (/\b14[:h ]?00\b/.test(s) || /\b(catorze|quatorze|duas)\b/.test(s))
    time = '14:00'
  else if (
    /\b16[:h ]?30\b/.test(s) ||
    /\bdezesseis\b/.test(s) ||
    (/\bquatro\b/.test(s) && /\b(meia|trinta)\b/.test(s))
  )
    time = '16:30'

  const confirm =
    /\b(sim|confirm|pode|isso|fechad|beleza|ok|manda|vai|agend|marc|bora)/.test(s)
  return { day, time, confirm }
}

export function SchedulingOverlay() {
  const { setFlowStep, booking, setBooking } = useApp()
  const dealership = dealerships.find((d) => d.id === booking.dealershipId)

  // Henry proactively asks for the day and time.
  useEffect(() => {
    const t = setTimeout(
      () => speak('Para quando quer agendar? Diga o dia e o horário.'),
      400
    )
    return () => clearTimeout(t)
  }, [])

  const handleVoice = (text: string) => {
    const p = parseSchedule(text)
    const nextDay = p.day ?? booking.dayId
    const nextTime = p.time ?? booking.time
    if (p.day) setBooking({ dayId: p.day })
    if (p.time) setBooking({ time: p.time })

    if (p.confirm && nextDay && nextTime) {
      speak('Perfeito. Confirmando.')
      setTimeout(() => setFlowStep('confirmation'), 200)
      return
    }
    if (nextDay && nextTime) {
      speak(`${daySpoken[nextDay]} às ${nextTime}. Confirmo?`)
    } else if (nextDay) {
      speak('E qual horário?')
    } else if (nextTime) {
      speak('Para qual dia?')
    } else {
      speak('Não entendi. Diga, por exemplo: amanhã às nove e quarenta.')
    }
  }

  return (
    <Overlay className="max-w-2xl">
      <div className="glass-strong scroll-area max-h-[92vh] overflow-y-auto rounded-[32px] p-6 shadow-glass-lg animate-fade-in-scale sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <button
            onClick={() => setFlowStep('dealership')}
            className="press grid h-10 w-10 place-items-center rounded-full bg-white/8 hover:bg-white/15"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Escolha o melhor horário</h2>
            {dealership && (
              <p className="flex items-center gap-1.5 text-sm text-white/55">
                <MapPin size={14} className="text-ford-periwinkle" />
                {dealership.name} · {dealership.distance}
              </p>
            )}
          </div>
        </div>

        {/* days */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2 text-white/70">
            <Calendar size={18} className="text-ford-periwinkle" />
            <span className="text-sm font-semibold">Data</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {dayOptions.map((d) => {
              const selected = booking.dayId === d.id
              return (
                <button
                  key={d.id}
                  onClick={() => setBooking({ dayId: d.id })}
                  className={cx(
                    'press flex flex-col items-center gap-0.5 rounded-2xl border py-4 transition-all',
                    selected
                      ? 'border-ford-periwinkle/60 bg-ford-periwinkle/15 ring-1 ring-ford-periwinkle/40'
                      : 'border-white/10 bg-white/[0.04] hover:border-white/25'
                  )}
                >
                  <span
                    className={cx(
                      'text-base font-bold',
                      selected ? 'text-white' : 'text-white/80'
                    )}
                  >
                    {d.label}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wide text-white/45">
                    {d.sub}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* times */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2 text-white/70">
            <Clock size={18} className="text-ford-periwinkle" />
            <span className="text-sm font-semibold">Horário</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {timeSlots.map((t) => {
              const selected = booking.time === t
              return (
                <button
                  key={t}
                  onClick={() => setBooking({ time: t })}
                  className={cx(
                    'press rounded-2xl border py-4 text-lg font-bold transition-all',
                    selected
                      ? 'border-ford-periwinkle/60 bg-ford-periwinkle/15 text-white ring-1 ring-ford-periwinkle/40'
                      : 'border-white/10 bg-white/[0.04] text-white/80 hover:border-white/25'
                  )}
                >
                  {t}
                </button>
              )
            })}
          </div>
        </div>

        {/* voice reply */}
        <div className="mb-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
          <VoiceReply
            intents={[{ test: /.+/, run: handleVoice }]}
            hint="Ex.: “amanhã às nove e quarenta” · depois “confirmar”"
          />
        </div>

        <Button
          block
          disabled={!booking.dayId || !booking.time}
          onClick={() => setFlowStep('confirmation')}
        >
          Confirmar agendamento
        </Button>
      </div>
    </Overlay>
  )
}
