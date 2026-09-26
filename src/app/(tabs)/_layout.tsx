import type { ColorValue } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router/js-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '@/store/AppContext'
import { colors } from '@/theme'
import type { IconName } from '@/data/scenarios'

const icon = (name: IconName) =>
  function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    return <Ionicons name={name} color={color as string} size={size} />
  }

export default function TabsLayout() {
  const { bookings, hasRecommendation } = useApp()
  const insets = useSafeAreaInsets()
  const upcoming = bookings.filter((b) => b.status === 'scheduled').length
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.periwinkle,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.45)',
        tabBarStyle: {
          backgroundColor: colors.navy900,
          borderTopColor: colors.border,
          height: 68 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom + 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: icon('home-outline') }} />
      <Tabs.Screen
        name="vehicle"
        options={{
          title: 'Veículo',
          tabBarIcon: icon('car-sport-outline'),
          tabBarBadge: hasRecommendation ? '!' : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.amber },
        }}
      />
      <Tabs.Screen name="henry" options={{ title: 'Henry', tabBarIcon: icon('sparkles-outline') }} />
      <Tabs.Screen
        name="bookings"
        options={{ title: 'Agenda', tabBarIcon: icon('calendar-outline'), tabBarBadge: upcoming || undefined }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: icon('person-circle-outline') }} />
    </Tabs>
  )
}
