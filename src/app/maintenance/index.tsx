import { Alert, Platform, Text, View } from 'react-native'
import { router } from 'expo-router'
import { Screen } from '@/components/Screen'
import { MaintenanceSeal } from '@/components/MaintenanceSeal'
import { Button, Card, EmptyState, IconBadge, Pill, Row, SectionTitle, txt } from '@/components/ui'
import { useApp } from '@/store/AppContext'
import { formatBRL, type MaintenanceRecord } from '@/data/maintenance'
import { colors, spacing } from '@/theme'

export default function MaintenanceScreen() {
  const { maintenance, sealActive, officialPct, officialCount, offCount, resaleValue, deleteMaintenance } = useApp()

  const askDelete = (m: MaintenanceRecord) => {
    const run = () => deleteMaintenance(m.id)
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.(`Excluir "${m.label}"?`)) run()
      return
    }
    Alert.alert('Excluir registro', `Excluir "${m.label}" do histórico?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: run },
    ])
  }

  return (
    <Screen
      edges={['bottom']}
      footer={<Button title="Registrar manutenção" icon="add-circle-outline" onPress={() => router.push('/maintenance/new')} />}
    >
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
        <MaintenanceSeal active={sealActive} size={84} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={txt.h3}>{sealActive ? 'Selo oficial ativo' : 'Selo pausado'}</Text>
          <Text style={txt.small}>
            {officialCount} na rede · {offCount} fora da rede · {officialPct}%
          </Text>
          <Text style={[txt.small, { color: colors.periwinkle }]}>Revenda estimada: {formatBRL(resaleValue)}</Text>
        </View>
      </Card>

      <SectionTitle>Histórico</SectionTitle>
      {maintenance.length === 0 ? (
        <EmptyState icon="document-text-outline" title="Sem registros" text="Registre as manutenções do seu Ford." />
      ) : (
        <View style={{ gap: spacing.md }}>
          {maintenance.map((m) => {
            const official = m.network === 'official'
            return (
              <Card
                key={m.id}
                onPress={() => askDelete(m)}
                accessibilityLabel={`${m.label}, ${m.date}, ${official ? 'rede oficial' : 'fora da rede'}. Toque para excluir.`}
              >
                <Row style={{ gap: spacing.md, alignItems: 'flex-start' }}>
                  <IconBadge
                    name={official ? 'shield-checkmark-outline' : 'construct-outline'}
                    color={official ? colors.periwinkle : colors.amber}
                  />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={txt.h3}>{m.label}</Text>
                    <Text style={txt.small}>
                      {m.date} · {m.system}
                    </Text>
                    {!!m.dealership && <Text style={txt.small}>{m.dealership}</Text>}
                    {m.scoreBefore != null && m.scoreAfter != null && (
                      <Text style={[txt.small, { color: colors.greenSoft }]}>
                        Health Score {m.scoreBefore} → {m.scoreAfter}
                      </Text>
                    )}
                  </View>
                  <Pill label={official ? 'Rede oficial' : 'Fora da rede'} color={official ? colors.periwinkle : colors.amber} />
                </Row>
              </Card>
            )
          })}
        </View>
      )}
    </Screen>
  )
}
