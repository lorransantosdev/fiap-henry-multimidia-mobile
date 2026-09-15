import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export function scoreColor(v: number) {
  if (v >= 85) return '#16A34A'
  if (v >= 70) return '#F59E0B'
  return '#DC2626'
}

/* ---------------------------------------------------------------- Button */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'lg' | 'md' | 'sm'

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  block?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'lg',
  block,
  className,
  children,
  ...rest
}: BtnProps) {
  const base =
    'press inline-flex items-center justify-center gap-2.5 rounded-2xl font-semibold tracking-tight select-none disabled:opacity-40 disabled:pointer-events-none'
  const sizes: Record<Size, string> = {
    lg: 'px-7 py-4 text-lg min-h-[60px]',
    md: 'px-5 py-3 text-base min-h-[52px]',
    sm: 'px-4 py-2.5 text-sm min-h-[44px]',
  }
  const variants: Record<Variant, string> = {
    primary:
      'bg-gradient-to-b from-[#3b57e0] to-[#2563EB] text-white shadow-[0_10px_30px_rgba(37,99,235,0.45)] hover:from-[#4a64e8] hover:to-[#2f6bf0] border border-white/10',
    secondary:
      'glass-strong text-white hover:border-ford-periwinkle/40',
    ghost: 'text-ford-periwinkle hover:bg-white/5',
    danger:
      'bg-gradient-to-b from-[#e2483b] to-[#DC2626] text-white shadow-[0_10px_30px_rgba(220,38,38,0.4)] border border-white/10',
  }
  return (
    <button
      className={cx(base, sizes[size], variants[variant], block && 'w-full', className)}
      {...rest}
    >
      {children}
    </button>
  )
}

/* ------------------------------------------------------------ HealthRing */

export function HealthRing({
  value,
  size = 200,
  stroke = 14,
  label,
  sub,
  from,
  color,
}: {
  value: number
  size?: number
  stroke?: number
  label?: ReactNode
  sub?: ReactNode
  from?: number
  color?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value)) / 100
  const dash = c * pct
  const ringColor = color ?? scoreColor(value)

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{
            transition: 'stroke-dasharray 1.1s cubic-bezier(0.16,1,0.3,1), stroke 0.6s ease',
            filter: `drop-shadow(0 0 10px ${ringColor}66)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="flex items-end justify-center gap-1 leading-none">
            {from !== undefined && (
              <span className="text-2xl font-semibold text-white/35 line-through mb-1">
                {from}
              </span>
            )}
            <span
              className="font-extrabold tracking-tight"
              style={{ fontSize: size * 0.28, color: ringColor }}
            >
              {value}
            </span>
            <span className="mb-2 text-lg font-semibold text-white/45">/100</span>
          </div>
          {label && <div className="mt-1 text-sm font-medium text-white/70">{label}</div>}
          {sub && <div className="text-xs text-white/45">{sub}</div>}
        </div>
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- Gauge bar */

export function GaugeBar({ label, value }: { label: string; value: number }) {
  const color = scoreColor(value)
  return (
    <div className="flex items-center gap-4">
      <div className="w-20 shrink-0 text-sm font-medium text-white/75">{label}</div>
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${value}%`,
            background: color,
            transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: `0 0 12px ${color}88`,
          }}
        />
      </div>
      <div className="w-9 shrink-0 text-right text-sm font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- Priority pill */

export function PriorityPill({ priority }: { priority: string }) {
  const map: Record<string, { bg: string; text: string; dot: string }> = {
    Alta: { bg: 'rgba(220,38,38,0.16)', text: '#ff8b82', dot: '#DC2626' },
    Média: { bg: 'rgba(245,158,11,0.16)', text: '#ffc766', dot: '#F59E0B' },
    Baixa: { bg: 'rgba(22,163,74,0.16)', text: '#5be08a', dot: '#16A34A' },
  }
  const s = map[priority] ?? map['Média']
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold"
      style={{ background: s.bg, color: s.text }}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: s.dot }} />
      Prioridade {priority}
    </span>
  )
}
