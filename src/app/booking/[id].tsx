import { Alert, Linking, Platform, Text, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Screen } from '@/components/Screen'
import { capitalize, statusInfo } from '@/components/BookingCard'
import { Button, Card, EmptyState, Pill, Row, SectionTitle, txt } from '@/components/ui'
import { useApp } from '@/store/AppContext'
import { dealerships } from '@/data/vehicle'
import { colors, spacing } from '@/theme'

function confirm(title: string, message: string, onOk: () => void) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${title}\n\n${message}`)) onOk()
    return
  }
  Alert.alert(title, message, [
    { text: 'Voltar', style: 'cancel' },
    { text: 'Confirmar', style: 'destructive', onPress: onOk },
  ])
}

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { bookings, startBooking, cancelBooking, deleteBooking, completeBooking } = useApp()
  const booking = bookings.find((b) => b.id === id)

  if (!booking) {
    return (
      <Screen edges={['bottom']}>
        <EmptyState icon="alert-circle-outline" title="Agendamento não encontrado" text="Ele pode ter sido excluído." />
      </Screen>
    )
  }

  const dealer = dealerships.find((d) => d.id === booking.dealershipId)
  const st = statusInfo[booking.status]
  const active = booking.status === 'scheduled'

  return (
    <Screen
      edges={['bottom']}
      footer={
        active ? (
          <>
            <Button
              title="Reagendar"
              icon="create-outline"
              onPress={() => {
                startBooking(booking.id)
                router.push('/schedule/dealership')
              }}
            />
            <Button
              title="Marcar como concluído (demo)"
              variant="secondary"
              icon="checkmark-done-outline"
              onPress={() => completeBooking(booking.id)}
            />
            <Button
              title="Cancelar agendamento"
              variant="danger"
              icon="close-circle-outline"
              onPress={() => confirm('Cancelar agendamento', 'A concessionária será avisada.', () => cancelBooking(booking.id))}
            />
          </>
        ) : (
          <Button
            title="Excluir do histórico"
            variant="danger"
            icon="trash-outline"
            onPress={() =>
              confirm('Excluir agendamento', 'Esta ação não pode ser desfeita.', () => {
                deleteBooking(booking.id)
                router.back()
              })
            }
          />
        )
      }
    >
      <Pill label={st.label} color={st.color} />
      <Text style={[txt.h1, { marginTop: spacing.sm }]}>{capitalize(booking.service)}</Text>
      <Text style={txt.body}>
        {booking.dayLabel} · {booking.time}
      </Text>

      <SectionTitle>Concessionária</SectionTitle>
      <Card style={{ gap: spacing.sm }}>
        <Text style={txt.h3}>{dealer?.name}</Text>
        <Text style={txt.body}>{dealer?.address}</Text>
        <Row style={{ gap: spacing.sm, marginTop: spacing.sm }}>
          <Button
            title="Ligar"
            variant="secondary"
            icon="call-outline"
            style={{ flex: 1 }}
            onPress={() => dealer && Linking.openURL(`tel:${dealer.phone.replace(/\D/g, '')}`)}
          />
          <Button
            title="Rota"
            variant="secondary"
            icon="navigate-outline"
            style={{ flex: 1 }}
            onPress={() =>
              dealer &&
              Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dealer.name + ' ' + dealer.address)}`)
            }
          />
        </Row>
      </Card>

      {!!booking.notes && (
        <>
          <SectionTitle>Observações</SectionTitle>
          <Card>
            <Text style={txt.body}>{booking.notes}</Text>
          </Card>
        </>
      )}

      <SectionTitle>Diagnóstico</SectionTitle>
      <Card>
        <Row style={{ gap: spacing.sm }}>
          <Ionicons name="cloud-done-outline" size={20} color={colors.greenSoft} />
          <View style={{ flex: 1 }}>
            <Text style={txt.body}>Diagnóstico do Henry compartilhado com a concessionária.</Text>
          </View>
        </Row>
      </Card>
    </Screen>
  )
}
