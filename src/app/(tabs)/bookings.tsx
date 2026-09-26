import { useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Background } from '@/components/Screen'
import { BookingCard } from '@/components/BookingCard'
import { Button, EmptyState, tap, txt } from '@/components/ui'
import { useApp } from '@/store/AppContext'
import { colors, radius, spacing } from '@/theme'

type Filter = 'active' | 'history'

export default function BookingsScreen() {
  const { bookings, startBooking } = useApp()
  const [filter, setFilter] = useState<Filter>('active')
  const data = bookings.filter((b) => (filter === 'active' ? b.status === 'scheduled' : b.status !== 'scheduled'))

  const newBooking = () => {
    startBooking()
    router.push('/schedule/dealership')
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Background />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ padding: spacing.lg, paddingBottom: 0 }}>
          <Text style={txt.overline}>Rede Ford</Text>
          <Text style={[txt.h1, { marginTop: 4 }]}>Agendamentos</Text>
          <View style={styles.segment} accessibilityRole="tablist">
            {(['active', 'history'] as const).map((f) => (
              <Pressable
                key={f}
                onPress={() => {
                  tap()
                  setFilter(f)
                }}
                style={[styles.segItem, filter === f && styles.segActive]}
                accessibilityRole="tab"
                accessibilityState={{ selected: filter === f }}
              >
                <Text style={[styles.segText, filter === f && { color: colors.white }]}>
                  {f === 'active' ? 'Ativos' : 'Histórico'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <FlatList
          data={data}
          keyExtractor={(b) => b.id}
          renderItem={({ item }) => <BookingCard booking={item} />}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, flexGrow: 1 }}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-clear-outline"
              title={filter === 'active' ? 'Nenhum agendamento ativo' : 'Sem histórico'}
              text={
                filter === 'active'
                  ? 'Agende um serviço na rede Ford — o diagnóstico do Henry vai junto.'
                  : 'Agendamentos concluídos ou cancelados aparecem aqui.'
              }
            />
          }
        />

        <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
          <Button title="Novo agendamento" icon="add-circle-outline" onPress={newBooking} />
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 4,
  },
  segItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.sm },
  segActive: { backgroundColor: colors.blue },
  segText: { color: colors.textMuted, fontWeight: '700' },
})
