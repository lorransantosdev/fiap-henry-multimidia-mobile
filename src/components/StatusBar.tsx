import { useEffect, useState } from 'react'
import { Cloud, MapPin, Wifi, Signal, Volume2, VolumeX } from 'lucide-react'
import { driver } from '../data/vehicle'
import { useApp } from '../store'
import { cx } from './ui'

export function StatusBar() {
  const { voiceEnabled, toggleVoice, speaking } = useApp()

  // Live clock — always the device's current time.
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const hh = now.getHours().toString().padStart(2, '0')
  const mm = now.getMinutes().toString().padStart(2, '0')

  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-5">
        <span className="text-2xl font-bold tracking-tight tabular-nums">
          {hh}:{mm}
        </span>
        <div className="hidden items-center gap-2 text-white/60 sm:flex">
          <Cloud size={17} className="text-ford-periwinkle" />
          <span className="text-base font-medium">23°C</span>
        </div>
        <div className="hidden items-center gap-1.5 text-white/60 md:flex">
          <MapPin size={15} className="text-ford-periwinkle" />
          <span className="text-sm">{driver.city}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <img
          src="/henry-lockup.png"
          alt="Henry"
          className={cx('h-5 opacity-85 transition-opacity', speaking && 'opacity-100')}
          draggable={false}
        />
        <button
          onClick={toggleVoice}
          className="press grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/8 hover:text-white/90"
          aria-label={voiceEnabled ? 'Silenciar Henry' : 'Ativar voz do Henry'}
        >
          {voiceEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>
        <div className="hidden items-center gap-3 text-white/50 sm:flex">
          <Wifi size={15} />
          <Signal size={15} />
        </div>
      </div>
    </div>
  )
}
