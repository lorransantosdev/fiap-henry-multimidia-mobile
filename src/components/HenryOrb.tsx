import { cx } from './ui'

/**
 * Henry's avatar — the brand DNA mark inside a soft disc.
 * `active` shows a gentle pulse; `speaking` intensifies the rings while Henry talks.
 */
export function HenryOrb({
  size = 88,
  active = false,
  alert = false,
  speaking = false,
  className,
}: {
  size?: number
  active?: boolean
  alert?: boolean
  speaking?: boolean
  className?: string
}) {
  const ring = alert ? 'rgba(245,158,11,0.55)' : 'rgba(137,159,254,0.55)'
  const glow = alert ? 'rgba(245,158,11,0.35)' : 'rgba(137,159,254,0.35)'
  const showRings = active || alert || speaking

  return (
    <div
      className={cx('relative grid place-items-center', className)}
      style={{ width: size, height: size }}
    >
      {showRings && (
        <span
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            border: `1.5px solid ${ring}`,
            animation: `pulse-ring ${speaking ? '1.4s' : '2.4s'} cubic-bezier(0.4,0,0.6,1) infinite`,
            willChange: 'transform, opacity',
          }}
        />
      )}
      {speaking && (
        <span
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            border: `1.5px solid ${ring}`,
            animation: 'pulse-ring 1.4s cubic-bezier(0.4,0,0.6,1) infinite',
            animationDelay: '0.7s',
            willChange: 'transform, opacity',
          }}
        />
      )}
      {/* disc */}
      <div
        className={cx('relative grid place-items-center rounded-full', speaking && 'animate-breathe')}
        style={{
          width: size * 0.82,
          height: size * 0.82,
          willChange: speaking ? 'transform' : undefined,
          background:
            'radial-gradient(circle at 50% 40%, rgba(10,23,110,0.9), rgba(4,9,58,0.95))',
          border: `1px solid ${ring}`,
          boxShadow: `0 0 ${speaking ? size * 0.5 : size * 0.28}px ${glow}, inset 0 0 ${size * 0.18}px rgba(137,159,254,0.15)`,
        }}
      >
        <img
          src="/henry-mark.png"
          alt="Henry"
          draggable={false}
          style={{
            width: size * 0.5,
            height: size * 0.5,
            objectFit: 'contain',
            filter: alert
              ? 'drop-shadow(0 0 6px rgba(245,158,11,0.5))'
              : 'drop-shadow(0 0 6px rgba(137,159,254,0.5))',
          }}
        />
      </div>
    </div>
  )
}
