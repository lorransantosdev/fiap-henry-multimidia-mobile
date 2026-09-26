import { useEffect, useState } from 'react'
import { Animated, Easing, Image, View } from 'react-native'
import { colors } from '@/theme'

export function HenryOrb({ size = 64, active = false }: { size?: number; active?: boolean }) {
  const [pulse] = useState(() => new Animated.Value(0))

  useEffect(() => {
    if (!active) {
      pulse.stopAnimation()
      pulse.setValue(0)
      return
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [active, pulse])

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] })
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.6] })

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.periwinkle,
          opacity: active ? opacity : 0.15,
          transform: [{ scale }],
        }}
      />
      <View
        style={{
          width: size * 0.86,
          height: size * 0.86,
          borderRadius: size,
          backgroundColor: colors.navy800,
          borderWidth: 1.5,
          borderColor: colors.periwinkle + '88',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={require('../../assets/henry-mark.png')}
          style={{ width: size * 0.6, height: size * 0.6 }}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      </View>
    </View>
  )
}
