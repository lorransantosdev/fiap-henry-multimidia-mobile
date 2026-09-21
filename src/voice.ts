// Lightweight text-to-speech wrapper (pt-BR) used to give Henry a proactive voice.
// No external deps — uses the browser SpeechSynthesis API.

let enabled = true
const listeners = new Set<(speaking: boolean) => void>()

function emit(speaking: boolean) {
  listeners.forEach((l) => l(speaking))
}

export function onSpeakingChange(cb: (speaking: boolean) => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

function synth(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
    ? window.speechSynthesis
    : null
}

// Warm up the voice list (voices load asynchronously in most browsers).
export function initVoices() {
  const s = synth()
  if (!s) return
  s.getVoices()
  s.addEventListener?.('voiceschanged', () => s.getVoices())
}

function pickVoice(): SpeechSynthesisVoice | null {
  const s = synth()
  if (!s) return null
  const voices = s.getVoices()
  return (
    voices.find((v) => /pt[-_]BR/i.test(v.lang)) ||
    voices.find((v) => /^pt/i.test(v.lang)) ||
    null
  )
}

export function isVoiceEnabled() {
  return enabled
}

export function setVoiceEnabled(v: boolean) {
  enabled = v
  if (!v) cancel()
}

export function cancel() {
  const s = synth()
  try {
    s?.cancel()
  } catch {
    /* noop */
  }
  emit(false)
}

/** Speak a line as Henry. Cancels anything currently being spoken. */
export function speak(text: string) {
  const s = synth()
  if (!s || !enabled) return
  try {
    s.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'pt-BR'
    u.rate = 1.15
    u.pitch = 1.0
    u.volume = 1
    const v = pickVoice()
    if (v) u.voice = v
    u.onstart = () => emit(true)
    u.onend = () => emit(false)
    u.onerror = () => emit(false)
    s.speak(u)
  } catch {
    /* noop */
  }
}
