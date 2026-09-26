import { useEffect } from 'react'
import { View } from 'react-native'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppProvider, useApp } from '@/store/AppContext'
import { HenryNotice } from '@/components/HenryNotice'
import { colors } from '@/theme'

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

SplashScreen.preventAutoHideAsync().catch(() => {})

function RootNavigator() {
  const { hydrated, session } = useApp()

  useEffect(() => {
    if (hydrated) SplashScreen.hideAsync().catch(() => {})
  }, [hydrated])

  if (!hydrated) return <View style={{ flex: 1, backgroundColor: colors.bg }} />

  const signedIn = !!session
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.navy900 },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={signedIn}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="alert" options={{ presentation: 'modal', title: 'Henry' }} />
          <Stack.Screen name="demo" options={{ presentation: 'modal', title: 'Modo apresentação' }} />
          <Stack.Screen name="off-network" options={{ presentation: 'modal', title: 'Manutenção detectada' }} />
          <Stack.Screen name="schedule/dealership" options={{ title: 'Concessionária' }} />
          <Stack.Screen name="schedule/slot" options={{ title: 'Data e horário' }} />
          <Stack.Screen name="schedule/confirmation" options={{ title: 'Confirmado', headerBackVisible: false, gestureEnabled: false }} />
          <Stack.Screen name="booking/[id]" options={{ title: 'Agendamento' }} />
          <Stack.Screen name="maintenance/index" options={{ title: 'Histórico de manutenção' }} />
          <Stack.Screen name="maintenance/new" options={{ presentation: 'modal', title: 'Registrar manutenção' }} />
        </Stack.Protected>
      </Stack>
      {signedIn && <HenryNotice />}
    </>
  )
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </AppProvider>
    </SafeAreaProvider>
  )
}
