import { useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Screen } from '@/components/Screen'
import { Button, txt } from '@/components/ui'
import { useApp } from '@/store/AppContext'
import { DEMO_USER, validateLogin } from '@/services/auth'
import { colors, radius, spacing } from '@/theme'

export default function LoginScreen() {
  const { signIn } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [authError, setAuthError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setAuthError(null)
    const v = validateLogin(email, password)
    setErrors(v)
    if (v.email || v.password) return
    setLoading(true)
    try {
      await signIn(email, password)
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'Não foi possível entrar.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setEmail(DEMO_USER.email)
    setPassword(DEMO_USER.password)
    setErrors({})
    setAuthError(null)
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen edges={['top', 'bottom']} contentStyle={styles.content}>
        <View style={styles.brand}>
          <Image source={require('../../assets/ford-oval.png')} style={styles.oval} resizeMode="contain" />
          <Image source={require('../../assets/henry-lockup.png')} style={styles.lockup} resizeMode="contain" />
          <Text style={[txt.body, { textAlign: 'center' }]}>
            Seu Ford conectado. O Henry monitora a saúde do veículo e cuida do agendamento na rede oficial.
          </Text>
        </View>

        <View style={{ gap: spacing.md }}>
          <View>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="voce@email.com"
              placeholderTextColor={colors.textFaint}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              style={[styles.input, errors.email && styles.inputError]}
              accessibilityLabel="E-mail"
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}
          </View>

          <View>
            <Text style={styles.label}>Senha</Text>
            <View>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••"
                placeholderTextColor={colors.textFaint}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={submit}
                style={[styles.input, { paddingRight: 52 }, errors.password && styles.inputError]}
                accessibilityLabel="Senha"
              />
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                style={styles.eye}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.textMuted} />
              </Pressable>
            </View>
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}
          </View>

          {authError && (
            <View style={styles.authError} accessibilityLiveRegion="polite">
              <Ionicons name="alert-circle-outline" size={18} color={colors.redSoft} />
              <Text style={{ color: colors.redSoft, flex: 1 }}>{authError}</Text>
            </View>
          )}

          <Button title="Entrar" icon="log-in-outline" onPress={submit} loading={loading} />
          <Button title="Usar conta de demonstração" variant="ghost" onPress={fillDemo} />
          <Text style={[txt.small, { textAlign: 'center' }]}>
            Demo: {DEMO_USER.email} · {DEMO_USER.password}
          </Text>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'center', gap: spacing.xxl },
  brand: { alignItems: 'center', gap: spacing.md },
  oval: { width: 110, height: 42 },
  lockup: { width: 220, height: 100 },
  label: { color: colors.textMuted, fontSize: 13, fontWeight: '600', marginBottom: 6 },
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
  inputError: { borderColor: colors.redSoft },
  error: { color: colors.redSoft, fontSize: 13, marginTop: 4 },
  eye: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 52, alignItems: 'center', justifyContent: 'center' },
  authError: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(220,38,38,0.12)',
  },
})
