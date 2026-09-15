// Speech-to-text wrapper (pt-BR) so the driver can answer Henry by voice.
// Uses the Web Speech API (SpeechRecognition / webkitSpeechRecognition).

/* eslint-disable @typescript-eslint/no-explicit-any */

export function recognitionSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  )
}

let current: any = null

export interface ListenHandlers {
  onStart?: () => void
  onResult?: (text: string, isFinal: boolean) => void
  onEnd?: (finalText: string) => void
  onError?: (error: string) => void
}

export function startListening(handlers: ListenHandlers) {
  const Ctor: any =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  if (!Ctor) {
    handlers.onError?.('unsupported')
    return null
  }
  stopListening()

  const rec = new Ctor()
  rec.lang = 'pt-BR'
  rec.interimResults = true
  rec.continuous = false
  rec.maxAlternatives = 1

  let finalText = ''

  rec.onstart = () => handlers.onStart?.()
  rec.onresult = (e: any) => {
    let interim = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i]
      if (r.isFinal) finalText += r[0].transcript
      else interim += r[0].transcript
    }
    handlers.onResult?.((finalText + interim).trim(), Boolean(finalText))
  }
  rec.onerror = (e: any) => handlers.onError?.(e?.error || 'error')
  rec.onend = () => {
    current = null
    handlers.onEnd?.(finalText.trim())
  }

  current = rec
  try {
    rec.start()
  } catch (err: any) {
    handlers.onError?.(err?.message || 'start-failed')
  }
  return rec
}

export function stopListening() {
  try {
    current?.stop()
  } catch {
    /* noop */
  }
  current = null
}
