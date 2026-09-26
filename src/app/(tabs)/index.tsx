import { StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Screen } from '@/components/Screen'
import { HealthRing } from '@/components/HealthRing'
import { HenryOrb } from '@/components/HenryOrb'
import { Button, Card, IconBadge, Pill, Row, SectionTitle, txt } from '@/components/ui'
import { useApp } from '@/store/AppContext'
import { dealerships, vehicle } from '@/data/vehicle'
import { colors, radius, spacing } from '@/theme'

export default function HomeScreen() {
  const { session, currentScore, hasRecommendation, scenario, sealActive, officialPct, bookings, speaking } = useApp()
  const next = bookings.find((b) => b.status === 'scheduled')
  const nextDealer = next && dealerships.find((d) => d.id === next.dealershipId)

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text style={txt.overline}>{vehicle.model} · {vehicle.plate}</Text>
          <Text style={[txt.h1, { marginTop: 4 }]}>Olá, {session?.name}</Text>
          <Text style={txt.body}>Como o Henry pode ajudar hoje?</Text>
        </View>
        <HenryOrb size={56} active={speaking} />
      </Row>

      {hasRecommendation && (
        <Card
          onPress={() => router.push('/alert')}
          accessibilityLabel={`Henry recomenda: ${scenario.recommendation}. Toque para ver detalhes.`}
          style={styles.alertCard}
        >
          <Row style={{ gap: spacing.md }}>
            <IconBadge name="warning-outline" color={colors.amber} />
            <View style={{ flex: 1 }}>
              <Text style={[txt.h3, { color: colors.amberSoft }]}>Henry recomenda uma inspeção</Text>
              <Text style={[txt.small, { color: 'rgba(253,230,138,0.75)' }]}>
                {scenario.system} · Prioridade {scenario.priority}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.amberSoft} />
          </Row>
        </Card>
      )}

      <Card style={styles.hero}>
        <Text style={txt.overline}>Saúde do veículo</Text>
        <HealthRing value={currentScore} size={176} />
        <Pill
          label={hasRecommendation ? 'Inspeção recomendada' : 'Monitoramento ativo'}
          color={hasRecommendation ? colors.amber : colors.greenSoft}
          icon={hasRecommendation ? 'alert-circle-outline' : 'pulse-outline'}
        />
        <Button
          title="Ver saúde do veículo"
          variant="secondary"
          icon="car-sport-outline"
          onPress={() => router.navigate('/vehicle')}
          style={{ alignSelf: 'stretch' }}
        />
      </Card>

      <SectionTitle>Acesso rápido</SectionTitle>
      <View style={styles.grid}>
        <QuickCard
          icon={sealActive ? 'shield-checkmark-outline' : 'shield-outline'}
          label={sealActive ? 'Selo Oficial' : 'Selo pausado'}
          sub={`${officialPct}% na rede Ford`}
          color={sealActive ? colors.periwinkle : colors.amber}
          onPress={() => router.push('/maintenance')}
        />
        <QuickCard
          icon="calendar-outline"
          label="Agendar"
          sub="Serviço na rede Ford"
          onPress={() => router.push('/schedule/dealership')}
        />
        <QuickCard icon="sparkles-outline" label="Falar com Henry" sub="Assistente" onPress={() => router.navigate('/henry')} />
        <QuickCard icon="pulse-outline" label="Simular evento" sub="Modo apresentação" onPress={() => router.push('/demo')} />
      </View>

      <SectionTitle>Próximo agendamento</SectionTitle>
      {next ? (
        <Card onPress={() => router.push({ pathname: '/booking/[id]', params: { id: next.id } })}>
          <Row style={{ gap: spacing.md }}>
            <IconBadge name="construct-outline" />
            <View style={{ flex: 1 }}>
              <Text style={txt.h3}>{next.service.charAt(0).toUpperCase() + next.service.slice(1)}</Text>
              <Text style={txt.small}>
                {next.dayLabel} · {next.time} · {nextDealer?.name}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textFaint} />
          </Row>
        </Card>
      ) : (
        <Card>
          <Text style={txt.body}>Nenhum serviço agendado. O Henry avisa quando algo precisar de atenção.</Text>
        </Card>
      )}
    </Screen>
  )
}

function QuickCard({
  icon,
  label,
  sub,
  color,
  onPress,
}: {
  icon: React.ComponentProps<typeof IconBadge>['name']
  label: string
  sub: string
  color?: string
  onPress: () => void
}) {
  return (
    <Card onPress={onPress} accessibilityLabel={`${label}. ${sub}`} style={styles.quick}>
      <IconBadge name={icon} color={color} size={40} />
      <Text style={[txt.h3, { marginTop: spacing.sm }]}>{label}</Text>
      <Text style={txt.small}>{sub}</Text>
    </Card>
  )
}

const styles = StyleSheet.create({
  alertCard: {
    marginTop: spacing.lg,
    backgroundColor: 'rgba(245,158,11,0.14)',
    borderColor: 'rgba(245,158,11,0.4)',
  },
  hero: { marginTop: spacing.lg, alignItems: 'center', gap: spacing.md, borderRadius: radius.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  quick: { width: '47.5%', flexGrow: 1 },
})
