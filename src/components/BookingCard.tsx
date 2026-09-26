import { Text, View } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import type { Booking, BookingStatus } from '@/store/AppContext'
import { dealerships } from '@/data/vehicle'
import { colors, spacing } from '@/theme'
import { Card, IconBadge, Pill, Row, txt } from './ui'

export const statusInfo: Record<BookingStatus, { label: string; color: string }> = {
  scheduled: { label: 'Agendado', color: colors.periwinkle },
  completed: { label: 'Concluído', color: colors.greenSoft },
  cancelled: { label: 'Cancelado', color: colors.redSoft },
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function BookingCard({ booking }: { booking: Booking }) {
  const dealer = dealerships.find((d) => d.id === booking.dealershipId)
  const st = statusInfo[booking.status]
  return (
    <Card
      onPress={() => router.push({ pathname: '/booking/[id]', params: { id: booking.id } })}
      accessibilityLabel={`${capitalize(booking.service)}, ${booking.dayLabel} às ${booking.time}, ${dealer?.name}. ${st.label}.`}
    >
      <Row style={{ gap: spacing.md }}>
        <IconBadge name="construct-outline" color={st.color} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={txt.h3} numberOfLines={1}>
            {capitalize(booking.service)}
          </Text>
          <Text style={txt.small}>
            {booking.dayLabel} · {booking.time}
          </Text>
          <Text style={txt.small} numberOfLines={1}>
            {dealer?.name}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: spacing.sm }}>
          <Pill label={st.label} color={st.color} />
          <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
        </View>
      </Row>
    </Card>
  )
}
