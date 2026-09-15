import type { ReactNode } from 'react'
import { cx } from './ui'

export function Overlay({
  children,
  onBackdrop,
  align = 'center',
  className,
}: {
  children: ReactNode
  onBackdrop?: () => void
  align?: 'center' | 'end'
  className?: string
}) {
  return (
    <div
      className={cx(
        'absolute inset-0 z-40 flex justify-center p-3 sm:p-5',
        align === 'center' ? 'items-center' : 'items-end'
      )}
    >
      <div
        className="absolute inset-0 bg-[#02061f]/70 backdrop-blur-md animate-fade-in"
        onClick={onBackdrop}
      />
      <div className={cx('relative z-10 w-full', className)}>{children}</div>
    </div>
  )
}
