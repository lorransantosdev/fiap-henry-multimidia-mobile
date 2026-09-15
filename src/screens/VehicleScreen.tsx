import { TrendingUp, Users, AlertTriangle, Wrench, Info, History } from 'lucide-react'
import { useApp } from '../store'
import { GaugeBar, HealthRing, cx } from '../components/ui'
import { healthTrend, timeline, vehicle } from '../data/vehicle'

function Sparkline({ data }: { data: number[] }) {
  const w = 260
  const h = 70
  const min = Math.min(...data) - 3
  const max = Math.max(...data) + 3
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min)) * h
    return [x, y] as const
  })
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  const area = `${path} L ${w} ${h} L 0 ${h} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[70px] w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#899FFE" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#899FFE" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark)" />
      <path d={path} fill="none" stroke="#899FFE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="4" fill="#fff" />
    </svg>
  )
}

const iconFor = {
  alert: { Icon: AlertTriangle, color: '#F59E0B' },
  service: { Icon: Wrench, color: '#2563EB' },
  info: { Icon: Info, color: '#899FFE' },
}

export function VehicleScreen() {
  const { currentScore, subsystems, hasRecommendation } = useApp()

  return (
    <div className="scroll-area h-full overflow-y-auto pr-1">
      <div className="mb-5 flex items-center gap-3 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Saúde do seu Ford</h1>
          <p className="text-white/55">
            {vehicle.model} {vehicle.variant} · {vehicle.mileage}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[300px_1fr]">
        {/* score + comparison */}
        <div className="flex flex-col gap-5">
          <div className="glass flex flex-col items-center gap-4 rounded-3xl p-6 shadow-glass animate-fade-in-scale">
            <HealthRing value={currentScore} size={190} label="Health Score" sub="Atualizado agora" />
            <div
              className={cx(
                'w-full rounded-2xl px-4 py-3 text-center text-sm font-semibold',
                hasRecommendation
                  ? 'bg-amber-500/15 text-amber-200'
                  : 'bg-emerald-500/15 text-emerald-300'
              )}
            >
              {hasRecommendation
                ? 'Uma inspeção preventiva é recomendada'
                : 'Todos os sistemas dentro do esperado'}
            </div>
          </div>

          <div className="glass flex items-center gap-4 rounded-3xl p-5 shadow-glass animate-fade-in-up">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ford-periwinkle/20">
              <Users className="text-ford-periwinkle" size={22} />
            </span>
            <p className="text-sm leading-snug text-white/75">
              Seu veículo está melhor que{' '}
              <span className="font-bold text-white">82% dos veículos similares.</span>
            </p>
          </div>
        </div>

        {/* subsystems + trend */}
        <div className="flex flex-col gap-5">
          <div className="glass rounded-3xl p-6 shadow-glass animate-fade-in-up">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">Sistemas monitorados</h2>
              <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                Tempo real
              </span>
            </div>
            <div className="flex flex-col gap-4">
              {subsystems.map((s) => (
                <GaugeBar key={s.label} label={s.label} value={s.value} />
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-6 shadow-glass animate-fade-in-up">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-ford-periwinkle" />
                <h2 className="text-lg font-bold">Evolução</h2>
              </div>
              <span className="text-xs font-medium text-white/45">Últimos 30 dias</span>
            </div>
            <Sparkline data={healthTrend} />
          </div>
        </div>
      </div>

      {/* timeline */}
      <div className="mt-5 glass rounded-3xl p-6 shadow-glass animate-fade-in-up">
        <div className="mb-5 flex items-center gap-2">
          <History size={18} className="text-ford-periwinkle" />
          <h2 className="text-lg font-bold">Histórico do veículo</h2>
        </div>
        <div className="relative">
          <div className="absolute bottom-3 left-[19px] top-3 w-px bg-white/12" />
          <div className="flex flex-col gap-5">
            {timeline.map((t, i) => {
              const { Icon, color } = iconFor[t.kind]
              return (
                <div
                  key={i}
                  className="relative flex items-start gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${i * 70}ms`, opacity: 0 }}
                >
                  <span
                    className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full"
                    style={{ background: `${color}26`, boxShadow: `0 0 0 4px #050d54` }}
                  >
                    <Icon size={18} style={{ color }} />
                  </span>
                  <div className="pt-1">
                    <div className="flex items-baseline gap-3">
                      <span className="text-base font-bold">{t.title}</span>
                      <span className="text-xs font-semibold uppercase tracking-wide text-white/40">
                        {t.when}
                      </span>
                    </div>
                    <p className="text-sm text-white/55">{t.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
