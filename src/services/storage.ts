import AsyncStorage from '@react-native-async-storage/async-storage'

const PREFIX = '@henry:'

export const StorageKeys = {
  session: 'session',
  bookings: 'bookings',
  maintenance: 'maintenance',
  demo: 'demo',
  settings: 'settings',
} as const

export async function load<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T) {
  return AsyncStorage.setItem(PREFIX + key, JSON.stringify(value)).catch(() => {})
}
