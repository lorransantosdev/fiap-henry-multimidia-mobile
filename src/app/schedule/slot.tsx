import { useMemo } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { router } from 'expo-router'
import { Screen } from '@/components/Screen'
import { Steps } from '@/components/Steps'
import { Button, Card, SectionTitle, tap, txt } from '@/components/ui'
import { useApp } from '@/store/AppContext'
import { buildDayOptions, dealerships, timeSlots } from '@/data/vehicle'
import { colors, radius, spacing } from '@/theme'

export default function SlotScreen() {
  const { draft, setDraft, commitDraft, scenario, hasRecommendation } = useApp()
  const days = useMemo(() => buildDayOptions(), [])
  const dealer = dealerships.find((d) => d.id === draft.dealershipId)
  const ready = !!draft.dayId && !!draft.time

  const confirm = () => {
    const booking = commitDraft()
    if (booking) router.replace({ pathname: '/schedule/confirmation', params: { id: booking.id } })
  }

  return (
    <Screen
      edges={['bottom']}
      footer={
        <Button
          title={draft.editingId ? 'Salvar novo horário' : 'Confirmar agendamento'}
          icon="checkmark-circle-outline"
          disabled={!ready}
          onPress={confirm}
        />
      }
    >
      <Steps current={1} />
      <Text style={txt.h2}>Escolha data e horário</Text>
      <Text style={txt.body}>{dealer?.name}</Text>

      <SectionTitle>Dia</SectionTitle>
      <View style={styles.wrap}>
        {days.map((d) => {
          const selected = draft.dayId === d.id
          return (
            <Pressable
              key={d.id}
              onPress={() => {
                tap()
                setDraft({ dayId: d.id, dayLabel: `${d.label} · ${d.sub}` })
              }}
              style={[styles.day, selected && styles.selected]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`${d.label}, ${d.sub}`}
            >
              <Text style={[styles.dayLabel, selected && { color: colors.white }]}>{d.label}</Text>
              <Text style={[styles.daySub, selected && { color: colors.white }]}>{d.sub}</Text>
            </Pressable>
          )
        })}
      </View>

      <SectionTitle>Horário</SectionTitle>
      <View style={styles.wrap}>
        {timeSlots.map((t) => {
          const selected = draft.time === t
          return (
            <Pressable
              key={t}
              onPress={() => {
                tap()
                setDraft({ time: t })
              }}
              style={[styles.time, selected && styles.selected]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Text style={[styles.timeText, selected && { color: colors.white }]}>{t}</Text>
            </Pressable>
          )
        })}
      </View>

      <SectionTitle>Observações (opcional)</SectionTitle>
      <TextInput
        value={draft.notes}
        onChangeText={(notes) => setDraft({ notes })}
        placeholder="Ex.: prefiro aguardar na concessionária"
        placeholderTextColor={colors.textFaint}
        multiline
        maxLength={200}
        style={styles.notes}
        accessibilityLabel="Observações"
      />
      <Text style={[txt.small, { textAlign: 'right', marginTop: 4 }]}>{draft.notes.length}/200</Text>

      {!draft.editingId && hasRecommendation && (
        <Card style={{ marginTop: spacing.lg }}>
          <Text style={txt.small}>Serviço</Text>
          <Text style={txt.h3}>{scenario.recommendation}</Text>
          <Text style={[txt.small, { marginTop: 4 }]}>Tempo estimado: {scenario.estimatedTime}</Text>
        </Card>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  day: {
    width: '31%',
    flexGrow: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayLabel: { color: colors.text, fontWeight: '700', fontSize: 15 },
  daySub: { color: colors.textFaint, fontSize: 12, marginTop: 2 },
  time: {
    width: '31%',
    flexGrow: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeText: { color: colors.text, fontWeight: '700', fontSize: 16 },
  selected: { backgroundColor: colors.blue, borderColor: colors.blue },
  notes: {
    minHeight: 88,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.text,
    padding: spacing.md,
    fontSize: 15,
    textAlignVertical: 'top',
  },
})
