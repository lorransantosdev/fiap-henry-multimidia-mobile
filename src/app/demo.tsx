import { Text, View } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Screen } from '@/components/Screen'
import { Card, IconBadge, Row, SectionTitle, txt } from '@/components/ui'
import { useApp } from '@/store/AppContext'
import { scenarioOrder, scenarios } from '@/data/scenarios'
import { colors, spacing } from '@/theme'

export default function DemoScreen() {
  const { runScenario, simulateOffNetwork, scenario, resultReady } = useApp()

  return (
    <Screen edges={['bottom']}>
      <Text style={txt.body}>
        Ferramenta para apresentadores. Escolha um evento: o Henry detecta e avisa o motorista de forma proativa.
      </Text>

      <SectionTitle>Cenários do Henry</SectionTitle>
      <View style={{ gap: spacing.md }}>
        {scenarioOrder.map((id) => {
          const sc = scenarios[id]
          const active = resultReady && scenario.id === id
          return (
            <Card
              key={id}
              onPress={() => {
                router.back()
                runScenario(id)
              }}
              accessibilityLabel={`Simular ${sc.demoLabel}. Health Score ${sc.newScore}.`}
              style={active ? { borderColor: sc.accent } : undefined}
            >
              <Row style={{ gap: spacing.md }}>
                <IconBadge name={sc.icon} color={sc.accent} />
                <View style={{ flex: 1 }}>
                  <Text style={txt.h3}>{sc.demoLabel}</Text>
                  <Text style={txt.small}>
                    Health Score {sc.newScore}
                    {sc.healthy ? '' : ` · Prioridade ${sc.priority}`}
                  </Text>
                </View>
                <Ionicons name="play-circle" size={28} color={sc.accent} />
              </Row>
            </Card>
          )
        })}
      </View>

      <SectionTitle>Selo de manutenção</SectionTitle>
      <Card
        onPress={() => {
          simulateOffNetwork()
          router.replace('/off-network')
        }}
        accessibilityLabel="Simular reparo fora da rede"
      >
        <Row style={{ gap: spacing.md }}>
          <IconBadge name="construct-outline" color={colors.amber} />
          <View style={{ flex: 1 }}>
            <Text style={txt.h3}>Reparo fora da rede</Text>
            <Text style={txt.small}>Health Score melhora sem registro na rede Ford</Text>
          </View>
          <Ionicons name="play-circle" size={28} color={colors.amber} />
        </Row>
      </Card>
    </Screen>
  )
}
