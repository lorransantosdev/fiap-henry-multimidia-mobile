import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Screen } from '@/components/Screen'
import { HenryOrb } from '@/components/HenryOrb'
import { HealthRing } from '@/components/HealthRing'
import { Button, Card, Pill, ProgressBar, Row, SectionTitle, txt } from '@/components/ui'
import { useApp } from '@/store/AppContext'
import { formatBRL } from '@/data/maintenance'
import { speak, stopSpeaking } from '@/services/voice'
import { colors, spacing } from '@/theme'

const priorityColor = { Baixa: colors.greenSoft, Média: colors.amber, Alta: colors.redSoft }

export default function AlertScreen() {
  const { scenario, currentScore, speaking, sealPremium, permanentPenalty, startBooking } = useApp()

  useEffect(() => {
    speak(scenario.spoken)
    return () => stopSpeaking()
  }, [scenario])

  const schedule = () => {
    startBooking()
    router.replace('/schedule/dealership')
  }

  return (
    <Screen
      edges={['bottom']}
      footer={
        scenario.healthy ? (
          <Button title="Entendi" onPress={() => router.back()} />
        ) : (
          <>
            <Button title="Agendar serviço Ford" icon="calendar-outline" onPress={schedule} />
            <Button title="Agora não" variant="secondary" onPress={() => router.back()} />
          </>
        )
      }
    >
      <Row style={{ gap: spacing.md }}>
        <HenryOrb size={56} active={speaking} />
        <View style={{ flex: 1 }}>
          <Text style={txt.h2}>{scenario.headline}</Text>
          <Text style={txt.body}>{scenario.subtitle}</Text>
        </View>
      </Row>

      <Row style={{ gap: spacing.sm, marginTop: spacing.lg, flexWrap: 'wrap' }}>
        <Pill label={scenario.system} color={scenario.accent} icon={scenario.icon} />
        {!scenario.healthy && (
          <Pill label={`Prioridade ${scenario.priority}`} color={priorityColor[scenario.priority]} icon="flag-outline" />
        )}
        <Pill
          label={speaking ? 'Henry falando…' : 'Recomendação por voz'}
          color={colors.periwinkle}
          icon="volume-high-outline"
        />
      </Row>

      <Card style={styles.metrics}>
        <HealthRing value={currentScore} size={112} stroke={10} />
        <View style={{ flex: 1, gap: spacing.sm }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={txt.small}>{scenario.healthy ? 'Risco' : 'Probabilidade'}</Text>
            <Text style={{ color: scenario.accent, fontSize: 22, fontWeight: '800' }}>{scenario.probability}%</Text>
          </Row>
          <ProgressBar value={scenario.probability} color={scenario.accent} />
          {!scenario.healthy && (
            <Row style={{ gap: 6, marginTop: 4 }}>
              <Ionicons name="time-outline" size={15} color={colors.textFaint} />
              <Text style={txt.small}>Serviço estimado: {scenario.estimatedTime}</Text>
            </Row>
          )}
        </View>
      </Card>
      <Button
        title="Ouvir novamente"
        variant="ghost"
        icon="play-circle-outline"
        style={{ marginTop: spacing.sm }}
        onPress={() => speak(scenario.spoken)}
      />

      <SectionTitle>O que isso significa?</SectionTitle>
      <Card style={{ gap: spacing.sm }}>
        {scenario.meaning.map((p) => (
          <Text key={p} style={txt.body}>
            {p}
          </Text>
        ))}
      </Card>

      <SectionTitle>Recomendação do Henry</SectionTitle>
      <Card style={{ gap: spacing.sm }}>
        <Row style={{ gap: spacing.sm }}>
          <Ionicons name="bulb-outline" size={20} color={colors.periwinkle} />
          <Text style={[txt.h3, { flex: 1 }]}>{scenario.recommendation}</Text>
        </Row>
        <Text style={txt.body}>{scenario.drivingNote}</Text>
      </Card>

      {!scenario.healthy && (
        <>
          <SectionTitle>Por que fazer na rede Ford?</SectionTitle>
          <Card style={{ gap: spacing.sm }}>
            <Row style={{ gap: spacing.sm }}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.periwinkle} />
              <Text style={[txt.body, { flex: 1 }]}>
                Mantém o Selo de Manutenção Oficial, que agrega {formatBRL(sealPremium)} ao valor de revenda.
              </Text>
            </Row>
            <Row style={{ gap: spacing.sm }}>
              <Ionicons name="trending-down-outline" size={20} color={colors.redSoft} />
              <Text style={[txt.body, { flex: 1 }]}>
                Serviços fora da rede geram perda permanente de {formatBRL(permanentPenalty)} por ocorrência.
              </Text>
            </Row>
            <Row style={{ gap: spacing.sm }}>
              <Ionicons name="share-outline" size={20} color={colors.greenSoft} />
              <Text style={[txt.body, { flex: 1 }]}>
                O diagnóstico é enviado à concessionária: {scenario.sharedData.join(', ').toLowerCase()}.
              </Text>
            </Row>
          </Card>
        </>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  metrics: { marginTop: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
})
