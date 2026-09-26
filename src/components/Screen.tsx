import type { ReactNode } from 'react'
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView, type Edge } from 'react-native-safe-area-context'
import { colors, spacing } from '@/theme'

export function Background() {
  return (
    <LinearGradient
      colors={[colors.navy700, colors.navy900, colors.bg]}
      locations={[0, 0.45, 1]}
      style={StyleSheet.absoluteFill}
    />
  )
}

export function Screen({
  children,
  scroll = true,
  edges = ['top'],
  contentStyle,
  footer,
}: {
  children: ReactNode
  scroll?: boolean
  edges?: Edge[]
  contentStyle?: StyleProp<ViewStyle>
  footer?: ReactNode
}) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Background />
      <SafeAreaView style={{ flex: 1 }} edges={edges}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={[styles.content, contentStyle]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.content, { flex: 1 }, contentStyle]}>{children}</View>
        )}
        {footer && <View style={styles.footer}>{footer}</View>}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: 'rgba(2,6,31,0.9)',
  },
})
