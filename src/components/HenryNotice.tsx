import { useEffect, useState } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { useApp } from '@/store/AppContext'
import { speak } from '@/services/voice'
import { colors, radius, spacing } from '@/theme'
import { HenryOrb } from './HenryOrb'
import { Button } from './ui'

export function HenryNotice() {
  const { noticeVisible, dismissNotice, scenario, speaking } = useApp()
  const insets = useSafeAreaInsets()
  const [y] = useState(() => new Animated.Value(-240))

  useEffect(() => {
    if (!noticeVisible) {
      y.setValue(-240)
      return
    }
    Haptics.notificationAsync(
      scenario.healthy ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning
    ).catch(() => {})
    Animated.spring(y, { toValue: 0, useNativeDriver: true, friction: 8 }).start()
    speak(scenario.voiceLine)
  }, [noticeVisible, scenario, y])

  if (!noticeVisible) return null

  const open = () => {
    dismissNotice()
    router.push('/alert')
  }

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      accessibilityViewIsModal
      style={[styles.wrap, { top: insets.top + spacing.sm, transform: [{ translateY: y }] }]}
    >
      <View style={styles.card}>
        <View style={styles.row}>
          <HenryOrb size={48} active={speaking} />
          <View style={{ flex: 1 }}>
            <Text style={styles.from}>Henry · agora</Text>
            <Text style={styles.text}>{scenario.voiceLine}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Button
            title={scenario.healthy ? 'Ver detalhes' : 'Sim, explicar'}
            icon="chatbubble-ellipses-outline"
            onPress={open}
            style={{ flex: 1 }}
          />
          <Button title="Agora não" variant="secondary" onPress={dismissNotice} style={{ flex: 1 }} />
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: spacing.md, right: spacing.md, zIndex: 100 },
  card: {
    backgroundColor: colors.navy800,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.periwinkle + '55',
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  from: { color: colors.periwinkle, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  text: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 2, lineHeight: 22 },
  actions: { flexDirection: 'row', gap: spacing.sm },
})
