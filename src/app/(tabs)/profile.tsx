import { Alert, Platform, StyleSheet, Switch, Text, View } from 'react-native'
import { router } from 'expo-router'
import Constants from 'expo-constants'
import { Screen } from '@/components/Screen'
import { Button, Card, IconBadge, Row, SectionTitle, txt } from '@/components/ui'
import { useApp } from '@/store/AppContext'
import { vehicle } from '@/data/vehicle'
import { colors, spacing } from '@/theme'

function confirm(title: string, message: string, onOk: () => void) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${title}\n\n${message}`)) onOk()
    return
  }
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Confirmar', style: 'destructive', onPress: onOk },
  ])
}

export default function ProfileScreen() {
  const { session, signOut, voiceEnabled, toggleVoice, resetDemo } = useApp()

  return (
    <Screen>
      <Text style={txt.overline}>Conta</Text>
      <Text style={[txt.h1, { marginTop: 4 }]}>Perfil</Text>

      <Card style={{ marginTop: spacing.lg }}>
        <Row style={{ gap: spacing.md }}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{session?.name?.[0] ?? '?'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={txt.h2}>{session?.name}</Text>
            <Text style={txt.small}>{session?.email}</Text>
          </View>
        </Row>
      </Card>

      <SectionTitle>Veículo conectado</SectionTitle>
      <Card style={{ gap: spacing.md }}>
        <Row style={{ gap: spacing.md }}>
          <IconBadge name="car-sport-outline" />
          <View style={{ flex: 1 }}>
            <Text style={txt.h3}>{vehicle.model}</Text>
            <Text style={txt.small}>
              {vehicle.variant} · {vehicle.year}
            </Text>
          </View>
        </Row>
        <Info label="Placa" value={vehicle.plate} />
        <Info label="Quilometragem" value={vehicle.mileage} />
        <Info label="Multimídia" value="Henry conectado" />
      </Card>

      <SectionTitle>Preferências</SectionTitle>
      <Card>
        <Row style={{ gap: spacing.md }}>
          <IconBadge name="volume-high-outline" />
          <View style={{ flex: 1 }}>
            <Text style={txt.h3}>Voz do Henry</Text>
            <Text style={txt.small}>Recomendações faladas em pt-BR</Text>
          </View>
          <Switch
            value={voiceEnabled}
            onValueChange={toggleVoice}
            trackColor={{ true: colors.blue, false: colors.cardStrong }}
            accessibilityLabel="Voz do Henry"
          />
        </Row>
      </Card>

      <SectionTitle>Apresentação</SectionTitle>
      <View style={{ gap: spacing.sm }}>
        <Button title="Modo apresentação (simular eventos)" variant="secondary" icon="pulse-outline" onPress={() => router.push('/demo')} />
        <Button
          title="Restaurar dados da demo"
          variant="ghost"
          icon="refresh-outline"
          onPress={() =>
            confirm('Restaurar demo', 'Agendamentos e histórico voltam ao estado inicial.', resetDemo)
          }
        />
      </View>

      <Button
        title="Sair"
        variant="danger"
        icon="log-out-outline"
        style={{ marginTop: spacing.xl }}
        onPress={() => confirm('Sair da conta', 'Deseja realmente sair?', signOut)}
      />
      <Text style={[txt.small, { textAlign: 'center', marginTop: spacing.lg }]}>
        Henry Ford · v{Constants.expoConfig?.version ?? '1.0.0'} · FIAP Challenge
      </Text>
    </Screen>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <Row style={{ justifyContent: 'space-between' }}>
      <Text style={txt.small}>{label}</Text>
      <Text style={{ color: colors.text, fontWeight: '600' }}>{value}</Text>
    </Row>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.white, fontSize: 24, fontWeight: '800' },
})
