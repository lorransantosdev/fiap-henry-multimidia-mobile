import { Home, Car, Navigation, Music, type LucideIcon } from 'lucide-react'
import { useApp, type Tab } from '../store'
import { cx } from './ui'
import { HenryOrb } from './HenryOrb'

const items: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'vehicle', label: 'Veículo', icon: Car },
  { id: 'nav', label: 'Navegação', icon: Navigation },
  { id: 'music', label: 'Música', icon: Music },
]

export function BottomNav() {
  const { tab, setTab, hasRecommendation, setHenryOpen, speaking } = useApp()

  return (
    <nav className="glass-strong flex items-center justify-between rounded-[26px] px-3 py-2.5 shadow-glass">
      <div className="flex flex-1 items-center justify-around">
        {items.map((it) => {
          const active = tab === it.id
          const Icon = it.icon
          return (
            <button
              key={it.id}
              onClick={() => setTab(it.id)}
              className={cx(
                'press flex min-w-[64px] flex-col items-center gap-1 rounded-2xl px-3 py-2 sm:min-w-[80px]',
                active ? 'text-white' : 'text-white/50 hover:text-white/80'
              )}
            >
              <span
                className={cx(
                  'grid h-9 w-9 place-items-center rounded-xl transition-colors',
                  active && 'bg-ford-periwinkle/20'
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 2} />
              </span>
              <span className="text-[11px] font-semibold tracking-tight">{it.label}</span>
            </button>
          )
        })}
      </div>

      {/* Henry — visually distinct assistant entry */}
      <button
        onClick={() => setHenryOpen(true)}
        className={cx(
          'press relative ml-1 flex items-center gap-3 rounded-2xl py-2 pl-3 pr-5 transition-all',
          hasRecommendation
            ? 'bg-gradient-to-r from-ford-periwinkle/25 to-ford-blue/20 ring-1 ring-ford-periwinkle/50'
            : 'hover:bg-white/5'
        )}
      >
        <HenryOrb
          size={44}
          alert={hasRecommendation}
          active={hasRecommendation}
          speaking={speaking}
        />
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-bold leading-tight">Henry</span>
          <span
            className={cx(
              'block text-[11px] font-medium leading-tight',
              hasRecommendation ? 'text-amber-300' : 'text-white/45'
            )}
          >
            {hasRecommendation ? '1 recomendação' : 'Assistente'}
          </span>
        </span>
        {hasRecommendation && (
          <span className="absolute right-3 top-2 h-2.5 w-2.5 rounded-full bg-status-amber shadow-[0_0_10px_rgba(245,158,11,0.9)]" />
        )}
      </button>
    </nav>
  )
}
