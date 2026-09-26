import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native'
import { renderRouter, screen, fireEvent } from 'expo-router/testing-library'

export async function seedSession() {
  await AsyncStorage.setItem(
    '@henry:session',
    JSON.stringify({ name: 'Pedro', email: 'pedro@ford.com', loggedAt: new Date().toISOString() })
  )
}

export async function openApp(url = '/') {
  const result = renderRouter('./src/app', { initialUrl: url })
  await screen.findAllByText(/\S/, {}, { timeout: 5000 })
  return result
}

export async function openLoggedIn(url = '/') {
  await seedSession()
  return openApp(url)
}

export function press(text: string | RegExp) {
  const nodes = screen.getAllByText(text)
  fireEvent.press(nodes[nodes.length - 1])
}

export function pressLabel(label: string | RegExp) {
  const nodes = screen.getAllByLabelText(label)
  fireEvent.press(nodes[nodes.length - 1])
}

export function confirmNextAlert() {
  return jest.spyOn(Alert, 'alert').mockImplementationOnce((_title, _msg, buttons) => {
    const ok = buttons?.find((b) => b.style === 'destructive') ?? buttons?.[buttons.length - 1]
    ok?.onPress?.()
  })
}

export async function readStored<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem('@henry:' + key)
  return raw ? (JSON.parse(raw) as T) : null
}
