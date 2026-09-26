import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { router } from 'expo-router'
import { Screen } from '@/components/Screen'
import { Button, Card, SectionTitle, tap, txt } from '@/components/ui'
import { useApp } from '@/store/AppContext'
import type { MaintenanceNetwork } from '@/data/maintenance'
import { dealerships, todayLabel } from '@/data/vehicle'
import { colors, radius, spacing } from '@/theme'

const systems = ['Motor', 'Freios', 'Bateria', 'Pneus', 'Fluidos', 'Geral']

export default function NewMaintenanceScreen() {
  const { addMaintenance } = useApp()
  const [label, setLabel] = useState('')
  const [system, setSystem] = useState<string | null>(null)
  const [network, setNetwork] = useState<MaintenanceNetwork>('official')
  const [place, setPlace] = useState(dealerships[0].name)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const save = () => {
    const e: Record<string, string> = {}
    if (label.trim().length < 3) e.label = 'Descreva o serviço (mín. 3 caracteres).'
    if (!system) e.system = 'Selecione o sistema.'
    if (!place.trim()) e.place = network === 'official' ? 'Selecione a concessionária.' : 'Informe a oficina.'
    setErrors(e)
    if (Object.keys(e).length) return

    addMaintenance({ label: label.trim(), system: system!, network, dealership: place.trim(), date: todayLabel() })
    if (network === 'off') router.replace('/off-network')
    else router.back()
  }

  return (
    <Screen edges={['bottom']} footer={<Button title="Salvar registro" icon="save-outline" onPress={save} />}>
      <Text style={txt.body}>Registre um serviço feito no seu Ford. Serviços na rede oficial mantêm o selo ativo.</Text>

      <SectionTitle>Serviço</SectionTitle>
      <TextInput
        value={label}
        onChangeText={setLabel}
        placeholder="Ex.: Troca de pastilhas de freio"
        placeholderTextColor={colors.textFaint}
        style={[styles.input, errors.label && styles.err]}
        accessibilityLabel="Descrição do serviço"
      />
      {errors.label && <Text style={styles.errText}>{errors.label}</Text>}

      <SectionTitle>Sistema</SectionTitle>
      <View style={styles.chips}>
        {systems.map((s) => (
          <Chip key={s} label={s} selected={system === s} onPress={() => setSystem(s)} />
        ))}
      </View>
      {errors.system && <Text style={styles.errText}>{errors.system}</Text>}

      <SectionTitle>Onde foi feito?</SectionTitle>
      <View style={styles.chips}>
        <Chip
          label="Rede Ford"
          selected={network === 'official'}
          onPress={() => {
            setNetwork('official')
            setPlace(dealerships[0].name)
          }}
        />
        <Chip
          label="Oficina externa"
          selected={network === 'off'}
          onPress={() => {
            setNetwork('off')
            setPlace('')
          }}
        />
      </View>

      {network === 'official' ? (
        <View style={[styles.chips, { marginTop: spacing.md }]}>
          {dealerships.map((d) => (
            <Chip key={d.id} label={d.name} selected={place === d.name} onPress={() => setPlace(d.name)} />
          ))}
        </View>
      ) : (
        <>
          <TextInput
            value={place}
            onChangeText={setPlace}
            placeholder="Nome da oficina"
            placeholderTextColor={colors.textFaint}
            style={[styles.input, { marginTop: spacing.md }, errors.place && styles.err]}
            accessibilityLabel="Nome da oficina"
          />
          <Card style={{ marginTop: spacing.md, borderColor: colors.amber + '66' }}>
            <Text style={[txt.small, { color: colors.amberSoft }]}>
              Serviços fora da rede pausam o Selo de Manutenção Oficial e reduzem o valor de revenda.
            </Text>
          </Card>
        </>
      )}
      {errors.place && <Text style={styles.errText}>{errors.place}</Text>}
    </Screen>
  )
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={() => {
        tap()
        onPress()
      }}
      style={[styles.chip, selected && styles.chipOn]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.chipText, selected && { color: colors.white }]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  input: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
  },
  err: { borderColor: colors.redSoft },
  errText: { color: colors.redSoft, fontSize: 13, marginTop: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipOn: { backgroundColor: colors.blue, borderColor: colors.blue },
  chipText: { color: colors.textMuted, fontWeight: '600' },
})
