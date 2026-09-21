import { useState } from 'react'
import { ShieldCheck, ShieldQuestion, Check, RotateCcw } from 'lucide-react'
import { cx } from './ui'

/** Official-maintenance seal medallion — a white certification disc with the Ford logo. */
export function MaintenanceSeal({
  active,
  size = 96,
  className,
}: {
  active: boolean
  size?: number
  className?: string
}) {
  const [imgOk, setImgOk] = useState(true)
  const ring = active ? '#2563EB' : '#9ca3af'
  const disc = active
    ? 'radial-gradient(circle at 50% 32%, #ffffff, #eaf0ff)'
    : 'radial-gradient(circle at 50% 32%, #e7ebf2, #c7cedb)'

  return (
    <div
      className={cx('relative grid shrink-0 place-items-center rounded-full', className)}
      style={{
        width: size,
        height: size,
        background: disc,
        border: `2px solid ${ring}`,
        boxShadow: `0 0 ${size * 0.26}px ${
          active ? 'rgba(37,99,235,0.4)' : 'rgba(148,163,184,0.22)'
        }, inset 0 0 ${size * 0.12}px rgba(10,26,122,0.08)`,
        opacity: active ? 1 : 0.9,
      }}
    >
      {/* dashed inner ring */}
      <span
        className="absolute rounded-full"
        style={{ inset: size * 0.09, border: `1px dashed ${ring}66` }}
      />

      {/* Ford logo (falls back to a shield if the asset is missing) */}
      {imgOk ? (
        <img
          src="/ford-oval.png"
          alt="Ford"
          draggable={false}
          onError={() => setImgOk(false)}
          style={{
            width: size * 0.66,
            objectFit: 'contain',
            filter: active ? 'none' : 'grayscale(1)',
          }}
        />
      ) : active ? (
        <ShieldCheck size={size * 0.4} style={{ color: '#0a1a7a' }} strokeWidth={2.2} />
      ) : (
        <ShieldQuestion size={size * 0.4} style={{ color: '#64748b' }} strokeWidth={2.2} />
      )}

      {/* status badge — green check when active, neutral "recoverable" otherwise */}
      <span
        className="absolute grid place-items-center rounded-full"
        style={{
          width: size * 0.34,
          height: size * 0.34,
          right: -size * 0.01,
          bottom: -size * 0.01,
          background: active ? '#16A34A' : '#899FFE',
          border: '2px solid #050d54',
          boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
        }}
      >
        {active ? (
          <Check size={size * 0.2} className="text-white" strokeWidth={3.2} />
        ) : (
          <RotateCcw size={size * 0.18} style={{ color: '#0a1a7a' }} strokeWidth={2.8} />
        )}
      </span>
    </div>
  )
}
