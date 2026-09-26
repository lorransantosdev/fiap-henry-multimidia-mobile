import { Text, View } from 'react-native'
import { router, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Screen } from '@/components/Screen'
import { Steps } from '@/components/Steps'
import { Button, Card, Row, txt } from '@/components/ui'
import { useApp } from '@/store/AppContext'
import { dealerships } from '@/data/vehicle'
import { colors, spacing } from '@/theme'

export default function DealershipScreen() {
  const { draft, setDraft } = useApp()

  return (
    <Screen
      edges={['bottom']}
      footer={
        <Button
          title="Continuar"
          icon="arrow-forward"
          disabled={!draft.dealershipId}
          onPress={() => router.push('/schedule/slot')}
        />
      }
    >
      <Stack.Screen options={{ title: draft.editingId ? 'Reagendar' : 'Concessionária' }} />
      <Steps current={0} />
      <Text style={txt.h2}>Escolha a concessionária</Text>
      <Text style={[txt.body, { marginBottom: spacing.lg }]}>
        Concessionárias Ford próximas de você. O diagnóstico do Henry é enviado automaticamente.
      </Text>

      <View style={{ gap: spacing.md }}>
        {dealerships.map((d) => {
          const selected = draft.dealershipId === d.id
          return (
            <Card
              key={d.id}
              onPress={() => setDraft({ dealershipId: d.id })}
              accessibilityLabel={`${d.name}, ${d.distance}, nota ${d.rating}. ${selected ? 'Selecionada' : ''}`}
              style={selected ? { borderColor: colors.periwinkle, backgroundColor: colors.periwinkle + '1A' } : undefined}
            >
              <Row style={{ gap: spacing.md, alignItems: 'flex-start' }}>
                <Ionicons
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={selected ? colors.periwinkle : colors.textFaint}
                  style={{ marginTop: 2 }}
                />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={txt.h3}>{d.name}</Text>
                  <Text style={txt.small}>{d.address}</Text>
                  <Row style={{ gap: spacing.md, marginTop: 4, flexWrap: 'wrap' }}>
                    <Meta icon="navigate-outline" text={d.distance} />
                    <Meta icon="star" text={`${d.rating} (${d.reviews})`} color={colors.amberSoft} />
                    <Meta icon="time-outline" text={d.firstSlot} />
                  </Row>
                </View>
              </Row>
            </Card>
          )
        })}
      </View>
    </Screen>
  )
}

function Meta({ icon, text, color = colors.textMuted }: { icon: React.ComponentProps<typeof Ionicons>['name']; text: string; color?: string }) {
  return (
    <Row style={{ gap: 4 }}>
      <Ionicons name={icon} size={13} color={color} />
      <Text style={{ color: colors.textMuted, fontSize: 12 }}>{text}</Text>
    </Row>
  )
}
