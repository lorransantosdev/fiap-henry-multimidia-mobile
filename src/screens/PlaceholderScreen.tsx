import { Navigation, Music, MapPin, Play, SkipBack, SkipForward } from 'lucide-react'
import { driver } from '../data/vehicle'

export function NavScreen() {
  return (
    <div className="grid h-full grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
      <div className="glass relative overflow-hidden rounded-3xl shadow-glass animate-fade-in-scale">
        {/* stylised map */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(80% 80% at 30% 20%, #0d1e6e 0%, #060f45 60%, #04093a 100%)',
          }}
        />
        <svg className="absolute inset-0 h-full w-full opacity-70" preserveAspectRatio="none">
          <path d="M -20 260 C 180 180, 260 320, 460 220 S 820 120, 1000 260" fill="none" stroke="#899FFE" strokeWidth="7" strokeLinecap="round" opacity="0.9" />
          <path d="M 120 -20 C 160 160, 320 240, 300 460" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
          <path d="M 560 -20 C 540 200, 700 300, 760 520" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
        </svg>
        <div className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
          <span className="absolute h-16 w-16 rounded-full bg-ford-periwinkle/30 animate-pulse-ring" />
          <span className="grid h-12 w-12 place-items-center rounded-full bg-ford-blue shadow-glow">
            <Navigation className="text-white" size={22} />
          </span>
        </div>
        <div className="glass-strong absolute left-5 top-5 rounded-2xl px-4 py-3">
          <div className="text-xs uppercase tracking-wider text-white/50">Destino</div>
          <div className="text-base font-bold">Casa · {driver.city}</div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="glass rounded-3xl p-5 shadow-glass animate-fade-in-up">
          <div className="text-4xl font-extrabold">18 min</div>
          <div className="text-white/55">12,4 km · chegada 09:00</div>
        </div>
        {['Av. das Nações Unidas', 'Marginal Pinheiros', 'Rua Henri Dunant'].map((r, i) => (
          <div
            key={r}
            className="glass flex items-center gap-3 rounded-2xl p-4 shadow-glass animate-fade-in-up"
            style={{ animationDelay: `${i * 70}ms`, opacity: 0 }}
          >
            <MapPin size={18} className="text-ford-periwinkle" />
            <span className="font-medium text-white/80">{r}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MusicScreen() {
  return (
    <div className="grid h-full place-items-center">
      <div className="glass flex w-full max-w-xl flex-col items-center gap-6 rounded-3xl p-10 shadow-glass animate-fade-in-scale">
        <div className="grid h-40 w-40 place-items-center rounded-3xl bg-gradient-to-br from-ford-periwinkle to-ford-blue shadow-glow">
          <Music size={64} className="text-white/90" />
        </div>
        <div className="text-center">
          <div className="text-2xl font-extrabold">Midnight Drive</div>
          <div className="text-white/55">Aurora Skies · Nightfall</div>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/3 rounded-full bg-ford-periwinkle" />
        </div>
        <div className="flex items-center gap-8">
          <SkipBack size={30} className="text-white/70" />
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-ford-navy">
            <Play size={28} fill="currentColor" />
          </span>
          <SkipForward size={30} className="text-white/70" />
        </div>
      </div>
    </div>
  )
}
