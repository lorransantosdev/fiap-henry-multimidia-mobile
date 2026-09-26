import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { router } from 'expo-router'
import { Screen } from '@/components/Screen'
import { HealthRing } from '@/components/HealthRing'
import { TrendChart } from '@/components/TrendChart'
import { MaintenanceSeal } from '@/components/MaintenanceSeal'
import { Button, Card, Pill, ProgressBar, Row, SectionTitle, txt } from '@/components/ui'
import { useApp } from '@/store/AppContext'
import { healthTrend, vehicle } from '@/data/vehicle'
import { formatBRL } from '@/data/maintenance'
import { colors, scoreColor, spacing } from '@/theme'

export default function VehicleScreen() {
  const {
    currentScore,
    subsystems,
    hasRecommendation,
    scenario,
    sealActive,
    officialPct,
    officialCount,
    maintenance,
    resaleValue,
    recoverable,
    permanentLoss,
  } = useApp()
  const { width } = useWindowDimensions()
  const trend = [...healthTrend.slice(0, -1), currentScore]

  return (
    <Screen>
      <Text style={txt.overline}>Meu veículo</Text>
      <Text style={[txt.h1, { marginTop: 4 }]}>{vehicle.model}</Text>
      <Text style={txt.body}>
        {vehicle.variant} · {vehicle.year} · {vehicle.mileage}
      </Text>

      <Card style={styles.hero}>
        <HealthRing value={currentScore} size={140} stroke={12} />
        <View style={{ flex: 1, gap: spacing.sm }}>
          <Text style={txt.h3}>{hasRecommendation ? 'Atenção preventiva' : 'Tudo sob controle'}</Text>
          <Text style={txt.small}>
            {hasRecommendation
              ? `${scenario.system}: ${scenario.probability}% de probabilidade de falha.`
              : 'O Henry monitora continuamente os sistemas do seu Ford.'}
          </Text>
          {hasRecommendation && (
            <Button title="Detalhes" variant="secondary" icon="chevron-forward" onPress={() => router.push('/alert')} />
          )}
        </View>
      </Card>

      <SectionTitle>Sistemas</SectionTitle>
      <Card style={{ gap: spacing.lg }}>
        {subsystems.map((s) => (
          <View key={s.label} accessible accessibilityLabel={`${s.label}: ${s.value} de 100`}>
            <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={[txt.h3, { fontSize: 15 }]}>{s.label}</Text>
              <Text style={{ color: scoreColor(s.value), fontWeight: '800' }}>{s.value}</Text>
            </Row>
            <ProgressBar value={s.value} color={scoreColor(s.value)} />
          </View>
        ))}
      </Card>

      <SectionTitle>Últimos 30 dias</SectionTitle>
      <Card>
        <Row style={{ justifyContent: 'space-between', marginBottom: spacing.sm }}>
          <Text style={txt.small}>Health Score</Text>
          <Text style={[txt.small, { color: colors.periwinkle }]}>
            {trend[0]} → {trend[trend.length - 1]}
          </Text>
        </Row>
        <TrendChart data={trend} width={width - spacing.lg * 4 - 2} />
      </Card>

      <SectionTitle>Selo de manutenção oficial</SectionTitle>
      <Card style={{ gap: spacing.lg }}>
        <Row style={{ gap: spacing.lg }}>
          <MaintenanceSeal active={sealActive} />
          <View style={{ flex: 1, gap: 4 }}>
            <Pill
              label={sealActive ? 'Selo ativo' : 'Selo pausado'}
              color={sealActive ? colors.periwinkle : colors.amber}
              icon={sealActive ? 'checkmark-circle' : 'pause-circle'}
            />
            <Text style={txt.small}>
              {officialCount} de {maintenance.length} serviços na rede Ford ({officialPct}%)
            </Text>
          </View>
        </Row>
        <View style={styles.valueBox}>
          <Text style={txt.small}>Valor de revenda estimado</Text>
          <Text style={[txt.h1, { fontSize: 26 }]}>{formatBRL(resaleValue)}</Text>
          {recoverable > 0 && (
            <Text style={{ color: colors.amberSoft, fontSize: 13, marginTop: 4 }}>
              Recupere {formatBRL(recoverable)} fazendo a próxima manutenção na rede Ford.
            </Text>
          )}
          {permanentLoss > 0 && (
            <Text style={{ color: colors.redSoft, fontSize: 13, marginTop: 4 }}>
              Perda permanente por serviços fora da rede: {formatBRL(permanentLoss)}
            </Text>
          )}
        </View>
        <Button title="Histórico de manutenção" variant="secondary" icon="list-outline" onPress={() => router.push('/maintenance')} />
      </Card>
    </Screen>
  )
}

const styles = StyleSheet.create({
  hero: { marginTop: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  valueBox: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 14, padding: spacing.md },
})
