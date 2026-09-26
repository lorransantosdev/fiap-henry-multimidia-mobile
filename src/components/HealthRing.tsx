import { Text, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { colors, scoreColor } from '@/theme'

export function HealthRing({
  value,
  size = 180,
  stroke = 14,
  label = 'Health Score',
  color,
}: {
  value: number
  size?: number
  stroke?: number
  label?: string
  color?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const ringColor = color ?? scoreColor(value)
  const offset = c * (1 - Math.max(0, Math.min(100, value)) / 100)
  return (
    <View
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      accessible
      accessibilityLabel={`${label}: ${value} de 100`}
    >
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={ringColor}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={offset}
        />
      </Svg>
      <Text style={{ color: colors.text, fontSize: size * 0.28, fontWeight: '800' }}>{value}</Text>
      {!!label && <Text style={{ color: colors.textFaint, fontSize: 12, fontWeight: '600' }}>{label}</Text>}
    </View>
  )
}
