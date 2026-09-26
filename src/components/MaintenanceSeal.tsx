import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/theme'

export function MaintenanceSeal({ active, size = 88 }: { active: boolean; size?: number }) {
  const color = active ? colors.blue : '#94a3b8'
  return (
    <View
      accessible
      accessibilityLabel={active ? 'Selo de manutenção oficial ativo' : 'Selo de manutenção oficial interrompido'}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 3,
        borderColor: color,
        borderStyle: active ? 'solid' : 'dashed',
        backgroundColor: color + '22',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name={active ? 'shield-checkmark' : 'shield-outline'} size={size * 0.38} color={active ? colors.periwinkle : color} />
      <Text style={{ color: active ? colors.periwinkle : color, fontSize: size * 0.12, fontWeight: '800', marginTop: 2 }}>
        {active ? 'OFICIAL' : 'PAUSADO'}
      </Text>
    </View>
  )
}
