import { View } from 'react-native'
import Svg, { Path, Circle } from 'react-native-svg'
import { colors } from '@/theme'

export function TrendChart({ data, width, height = 80 }: { data: number[]; width: number; height?: number }) {
  const min = Math.min(...data) - 3
  const max = Math.max(...data) + 3
  const x = (i: number) => (i / (data.length - 1)) * (width - 8) + 4
  const y = (v: number) => height - ((v - min) / (max - min)) * (height - 8) - 4
  const d = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const last = data.length - 1
  return (
    <View accessible accessibilityLabel={`Evolução do Health Score: de ${data[0]} para ${data[last]}`}>
      <Svg width={width} height={height}>
        <Path d={d} stroke={colors.periwinkle} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx={x(last)} cy={y(data[last])} r={4} fill={colors.periwinkle} />
      </Svg>
    </View>
  )
}
