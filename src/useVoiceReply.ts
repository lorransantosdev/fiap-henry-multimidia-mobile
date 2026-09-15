import { useCallback, useEffect, useRef, useState } from 'react'
import { recognitionSupported, startListening, stopListening } from './recognition'

export interface Intent {
  test: RegExp
  /** receives the (lower-cased) final transcript */
  run: (text: string) => void
}

/**
 * Lets the driver answer Henry by voice. Provide intents (regex → action);
 * the first match on the final transcript is executed.
 */
export function useVoiceReply(intents: Intent[]) {
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState('')
  const [denied, setDenied] = useState(false)
  const intentsRef = useRef(intents)
  intentsRef.current = intents
  const supported = recognitionSupported()

  const start = useCallback(() => {
    if (!recognitionSupported()) return
    setHeard('')
    startListening({
      onStart: () => setListening(true),
      onResult: (t) => setHeard(t),
      onError: (err) => {
        setListening(false)
        if (err === 'not-allowed' || err === 'service-not-allowed') setDenied(true)
      },
      onEnd: (finalText) => {
        setListening(false)
        const text = finalText.toLowerCase()
        if (!text) return
        const hit = intentsRef.current.find((i) => i.test.test(text))
        hit?.run(text)
      },
    })
  }, [])

  const stop = useCallback(() => {
    stopListening()
    setListening(false)
  }, [])

  // Clean up if the component unmounts mid-listen.
  useEffect(() => () => stopListening(), [])

  return { supported, listening, heard, denied, start, stop }
}
