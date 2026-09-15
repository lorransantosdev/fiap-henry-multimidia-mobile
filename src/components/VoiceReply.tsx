import { useEffect, useRef } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { useApp } from '../store'
import { useVoiceReply, type Intent } from '../useVoiceReply'
import { cx } from './ui'

/**
 * Mic control that lets the driver answer Henry by voice.
 * Tap to talk, and (hands-free) it opens the mic automatically once Henry
 * finishes asking his question.
 */
export function VoiceReply({
  intents,
  autoListen = true,
  hint = '“Sim” · “Explicar” · “Agendar” · “Agora não”',
  className,
}: {
  intents: Intent[]
  autoListen?: boolean
  hint?: string
  className?: string
}) {
  const { speaking, voiceEnabled } = useApp()
  const { supported, listening, heard, denied, start, stop } = useVoiceReply(intents)
  const prevSpeaking = useRef(false)
  const didInitial = useRef(false)

  // Hands-free: begin listening right after Henry finishes speaking. Re-arms on
  // every question, so multi-step voice dialogs (e.g. day → time) keep flowing.
  useEffect(() => {
    if (!autoListen || !supported || denied) {
      prevSpeaking.current = speaking
      return
    }
    // Voice output disabled → Henry never "speaks", so open the mic once.
    if (!voiceEnabled && !didInitial.current) {
      didInitial.current = true
      const t = setTimeout(() => start(), 400)
      return () => clearTimeout(t)
    }
    // Falling edge of speaking (Henry just finished a question) → listen.
    if (prevSpeaking.current && !speaking) {
      prevSpeaking.current = speaking
      const t = setTimeout(() => start(), 450)
      return () => clearTimeout(t)
    }
    prevSpeaking.current = speaking
  }, [speaking, voiceEnabled, autoListen, supported, denied, start])

  if (!supported) return null

  return (
    <div className={cx('flex items-center gap-3', className)}>
      <button
        onClick={() => (listening ? stop() : start())}
        className={cx(
          'press relative grid h-12 w-12 shrink-0 place-items-center rounded-full transition-colors',
          listening
            ? 'bg-ford-periwinkle text-ford-navy'
            : 'glass-strong text-ford-periwinkle hover:border-ford-periwinkle/40'
        )}
        aria-label={listening ? 'Parar de ouvir' : 'Responder por voz'}
      >
        {listening && (
          <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-ford-periwinkle/60" />
        )}
        {denied ? <MicOff size={20} /> : <Mic size={20} />}
      </button>
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wider text-white/45">
          {denied
            ? 'Microfone bloqueado'
            : listening
            ? 'Ouvindo você…'
            : 'Responda por voz'}
        </div>
        <div className="truncate text-sm text-white/75">
          {heard || (listening ? '…' : hint)}
        </div>
      </div>
    </div>
  )
}
