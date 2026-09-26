import { useEffect, useState } from 'react'
import { Animated, Easing, StyleSheet, Text, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { Screen } from '@/components/Screen'
import { Steps } from '@/components/Steps'
import { HenryOrb } from '@/components/HenryOrb'
import { capitalize } from '@/components/BookingCard'
import { Button, Card, IconBadge, Row, SectionTitle, txt } from '@/components/ui'
import { useApp } from '@/store/AppContext'
import { scenarios } from '@/data/scenarios'
import { dealerships } from '@/data/vehicle'
import { speak } from '@/services/voice'
import { colors, spacing } from '@/theme'

export default function ConfirmationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { bookings } = useApp()
  const booking = bookings.find((b) => b.id === id)
  const dealer = dealerships.find((d) => d.id === booking?.dealershipId)
  const sc = booking ? scenarios[booking.scenarioId] : undefined
  const [flow] = useState(() => new Animated.Value(0))

  const bookingId = booking?.id
  const spokenLine =
    booking && dealer
      ? `Pronto! Agendei para ${booking.dayLabel.split(' · ')[0].toLowerCase()} às ${booking.time}. Já enviei o diagnóstico para a ${dealer.name}.`
      : null

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
    const loop = Animated.loop(
      Animated.timing(flow, { toValue: 1, duration: 1600, easing: Easing.linear, useNativeDriver: true })
    )
    loop.start()
    return () => loop.stop()
  }, [flow])

  useEffect(() => {
    if (spokenLine) speak(spokenLine)
  }, [bookingId, spokenLine])

  if (!booking) {
    return (
      <Screen edges={['bottom']}>
        <Text style={txt.body}>Agendamento não encontrado.</Text>
        <Button title="Voltar ao início" onPress={() => router.dismissTo('/')} />
      </Screen>
    )
  }

  const dotX = flow.interpolate({ inputRange: [0, 1], outputRange: [-40, 40] })

  return (
    <Screen
      edges={['bottom']}
      footer={
        <>
          <Button title="Ver meus agendamentos" icon="calendar-outline" onPress={() => router.dismissTo('/bookings')} />
          <Button title="Voltar ao início" variant="secondary" onPress={() => router.dismissTo('/')} />
        </>
      }
    >
      <Steps current={2} />
      <View style={{ alignItems: 'center', gap: spacing.sm }}>
        <Ionicons name="checkmark-circle" size={64} color={colors.greenSoft} />
        <Text style={[txt.h1, { textAlign: 'center' }]}>Agendamento confirmado</Text>
        <Text style={[txt.body, { textAlign: 'center' }]}>Você não precisa explicar o problema.</Text>
      </View>

      <Card style={styles.flow}>
        <Node icon="car-sport-outline" label="Veículo" />
        <Link x={dotX} />
        <View style={{ alignItems: 'center', gap: 6 }}>
          <HenryOrb size={48} active />
          <Text style={txt.small}>Henry</Text>
        </View>
        <Link x={dotX} />
        <Node icon="business-outline" label="Concessionária" />
      </Card>

      <SectionTitle>Detalhes</SectionTitle>
      <Card style={{ gap: spacing.md }}>
        <Detail icon="construct-outline" label="Serviço" value={capitalize(booking.service)} />
        <Detail icon="business-outline" label="Local" value={`${dealer?.name}\n${dealer?.address}`} />
        <Detail icon="calendar-outline" label="Quando" value={`${booking.dayLabel} · ${booking.time}`} />
        {!!booking.notes && <Detail icon="chatbox-outline" label="Observações" value={booking.notes} />}
      </Card>

      {sc && sc.sharedData.length > 0 && (
        <>
          <SectionTitle>Diagnóstico enviado</SectionTitle>
          <Card style={{ gap: spacing.sm }}>
            {sc.sharedData.map((d) => (
              <Row key={d} style={{ gap: spacing.sm }}>
                <Ionicons name="checkmark" size={18} color={colors.greenSoft} />
                <Text style={txt.body}>{d}</Text>
              </Row>
            ))}
          </Card>
        </>
      )}
    </Screen>
  )
}

function Node({ icon, label }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 6, width: 84 }}>
      <IconBadge name={icon} size={48} />
      <Text style={txt.small} numberOfLines={1}>
        {label}
      </Text>
    </View>
  )
}

function Link({ x }: { x: Animated.AnimatedInterpolation<number> }) {
  return (
    <View style={styles.link}>
      <Animated.View style={[styles.dot, { transform: [{ translateX: x }] }]} />
    </View>
  )
}

function Detail({ icon, label, value }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; value: string }) {
  return (
    <Row style={{ gap: spacing.md, alignItems: 'flex-start' }}>
      <Ionicons name={icon} size={20} color={colors.periwinkle} style={{ marginTop: 2 }} />
      <View style={{ flex: 1 }}>
        <Text style={txt.small}>{label}</Text>
        <Text style={[txt.h3, { fontSize: 15 }]}>{value}</Text>
      </View>
    </Row>
  )
}

const styles = StyleSheet.create({
  flow: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  link: { flex: 1, height: 2, backgroundColor: colors.border, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.periwinkle },
})
