import { Text, View } from 'react-native'
import { colors, spacing } from '@/theme'

const labels = ['Concessionária', 'Horário', 'Confirmação']

export function Steps({ current }: { current: 0 | 1 | 2 }) {
  return (
    <View
      style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}
      accessible
      accessibilityLabel={`Etapa ${current + 1} de 3: ${labels[current]}`}
    >
      {labels.map((l, i) => (
        <View key={l} style={{ flex: 1, gap: 6 }}>
          <View style={{ height: 4, borderRadius: 2, backgroundColor: i <= current ? colors.periwinkle : colors.cardStrong }} />
          <Text style={{ color: i <= current ? colors.periwinkle : colors.textFaint, fontSize: 11, fontWeight: '700' }}>{l}</Text>
        </View>
      ))}
    </View>
  )
}
