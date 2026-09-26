import { useEffect } from 'react'
import { Text, View } from 'react-native'
import { router } from 'expo-router'
import { Screen } from '@/components/Screen'
import { HenryOrb } from '@/components/HenryOrb'
import { MaintenanceSeal } from '@/components/MaintenanceSeal'
import { Button, Card, Row, SectionTitle, txt } from '@/components/ui'
import { useApp } from '@/store/AppContext'
import { formatBRL } from '@/data/maintenance'
import { speak, stopSpeaking } from '@/services/voice'
import { colors, spacing } from '@/theme'

export default function OffNetworkScreen() {
  const { maintenance, resaleValue, resaleWithSeal, recoverable, permanentPenalty, speaking, startBooking } = useApp()
  const last = maintenance[0]

  useEffect(() => {
    speak(
      `Registrei uma manutenção fora da rede Ford em ${last?.system ?? 'seu veículo'}. O selo oficial foi pausado, mas você pode reativá-lo na próxima manutenção.`
    )
    return () => stopSpeaking()
  }, [last?.system])

  return (
    <Screen
      edges={['bottom']}
      footer={
        <>
          <Button title="Agendar na rede Ford" icon="calendar-outline" onPress={() => {
              startBooking()
              router.replace('/schedule/dealership')
            }} />
          <Button title="Entendi" variant="secondary" onPress={() => router.back()} />
        </>
      }
    >
      <Row style={{ gap: spacing.md }}>
        <HenryOrb size={56} active={speaking} />
        <View style={{ flex: 1 }}>
          <Text style={txt.h2}>Manutenção fora da rede</Text>
          <Text style={txt.body}>
            {last?.scoreBefore != null && last?.scoreAfter != null
              ? `${last.system}: Health Score ${last.scoreBefore} → ${last.scoreAfter}, sem registro em concessionária Ford.`
              : `${last?.label ?? 'Serviço'} realizado em ${last?.dealership ?? 'oficina externa'}.`}
          </Text>
        </View>
      </Row>

      <Card style={{ marginTop: spacing.lg, alignItems: 'center', gap: spacing.md }}>
        <MaintenanceSeal active={false} size={104} />
        <Text style={[txt.h3, { textAlign: 'center' }]}>Selo de Manutenção Oficial pausado</Text>
        <Text style={[txt.body, { textAlign: 'center' }]}>
          O selo não é punitivo: ele volta assim que a próxima manutenção for feita na rede Ford.
        </Text>
      </Card>

      <SectionTitle>Impacto no valor de revenda</SectionTitle>
      <Card style={{ gap: spacing.md }}>
        <Line label="Com selo oficial" value={formatBRL(resaleWithSeal)} />
        <Line label="Valor atual estimado" value={formatBRL(resaleValue)} color={colors.amberSoft} />
        <Line label="Recuperável (reativando o selo)" value={formatBRL(recoverable)} color={colors.greenSoft} />
        <Line label="Perda permanente deste reparo" value={formatBRL(permanentPenalty)} color={colors.redSoft} />
      </Card>
    </Screen>
  )
}

function Line({ label, value, color = colors.text }: { label: string; value: string; color?: string }) {
  return (
    <Row style={{ justifyContent: 'space-between' }}>
      <Text style={[txt.small, { flex: 1 }]}>{label}</Text>
      <Text style={{ color, fontWeight: '800', fontSize: 16 }}>{value}</Text>
    </Row>
  )
}
