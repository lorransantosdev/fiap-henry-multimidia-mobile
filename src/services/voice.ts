import * as Speech from 'expo-speech'

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

export function setVoiceEnabled(v: boolean) {
  enabled = v
  if (!v) stopSpeaking()
}

export function stopSpeaking() {
  Speech.stop().catch(() => {})
  emit(false)
}

export function speak(text: string) {
  if (!enabled) return
  Speech.stop().catch(() => {})
  Speech.speak(text, {
    language: 'pt-BR',
    rate: 1.05,
    pitch: 1.0,
    onStart: () => emit(true),
    onDone: () => emit(false),
    onStopped: () => emit(false),
    onError: () => emit(false),
  })
}
