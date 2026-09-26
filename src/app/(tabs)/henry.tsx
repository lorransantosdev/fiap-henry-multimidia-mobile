import { useRef, useState } from 'react'
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { router, type Href } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Background } from '@/components/Screen'
import { HenryOrb } from '@/components/HenryOrb'
import { tap } from '@/components/ui'
import { useApp } from '@/store/AppContext'
import { formatBRL } from '@/data/maintenance'
import { dealerships } from '@/data/vehicle'
import { speak, stopSpeaking } from '@/services/voice'
import { colors, radius, spacing } from '@/theme'

interface Message {
  id: string
  from: 'henry' | 'user'
  text: string
  action?: { label: string; href: Href }
}

let messageSeq = 0

const suggestions = [
  'Como está meu carro?',
  'Agendar um serviço',
  'Quanto vale meu carro?',
  'Meus agendamentos',
  'O que é o selo oficial?',
]

export default function HenryScreen() {
  const app = useApp()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'hello',
      from: 'henry',
      text: `Olá, ${app.session?.name ?? 'motorista'}! Sou o Henry, a inteligência do seu Ford. Pergunte sobre a saúde do veículo, agendamentos ou o valor de revenda.`,
    },
  ])
  const list = useRef<FlatList<Message>>(null)

  const answer = (q: string): Omit<Message, 'id' | 'from'> => {
    const t = q.toLowerCase()
    if (/(sa[uú]de|como est[aá]|score|problema|diagn)/.test(t)) {
      return app.hasRecommendation
        ? {
            text: `Seu Health Score está em ${app.currentScore}. Notei um sinal em ${app.scenario.system.toLowerCase()} com ${app.scenario.probability}% de probabilidade. ${app.scenario.recommendation}`,
            action: { label: 'Ver recomendação', href: '/alert' },
          }
        : { text: `Seu Health Score está em ${app.currentScore}. Tudo dentro do esperado — sigo monitorando.` }
    }
    if (/(agendar|marcar|revis|inspe|servi[cç]o)/.test(t)) {
      return {
        text: 'Posso agendar na rede Ford agora. O diagnóstico vai direto para a concessionária — você não precisa explicar o problema.',
        action: { label: 'Agendar serviço', href: '/schedule/dealership' },
      }
    }
    if (/(agendamento|agenda|hor[aá]rio|marcado)/.test(t)) {
      const next = app.bookings.find((b) => b.status === 'scheduled')
      if (!next) return { text: 'Você não tem agendamentos ativos no momento.' }
      const d = dealerships.find((x) => x.id === next.dealershipId)
      return {
        text: `Seu próximo agendamento é ${next.dayLabel.toLowerCase()} às ${next.time}, na ${d?.name}.`,
        action: { label: 'Ver agenda', href: '/bookings' },
      }
    }
    if (/(vale|revenda|pre[cç]o|valor)/.test(t)) {
      return {
        text: `O valor de revenda estimado do seu Ford é ${formatBRL(app.resaleValue)}.${
          app.recoverable > 0 ? ` Você pode recuperar ${formatBRL(app.recoverable)} reativando o selo oficial.` : ' O selo oficial está ativo e valoriza seu carro.'
        }`,
      }
    }
    if (/(selo|oficial|rede)/.test(t)) {
      return {
        text: `O Selo de Manutenção Oficial indica que a manutenção mais recente foi feita na rede Ford. Ele agrega ${formatBRL(app.sealPremium)} ao valor de revenda. Hoje ${app.officialPct}% dos seus serviços foram na rede.`,
        action: { label: 'Ver histórico', href: '/maintenance' },
      }
    }
    if (/(oi|ol[aá]|bom dia|boa tarde|boa noite)/.test(t)) {
      return { text: 'Olá! Em que posso ajudar?' }
    }
    return { text: 'Ainda não sei responder isso. Tente perguntar sobre a saúde do carro, agendamentos, selo oficial ou valor de revenda.' }
  }

  const send = (text: string) => {
    const q = text.trim()
    if (!q) return
    tap()
    const reply = answer(q)
    const now = ++messageSeq
    setMessages((prev) => [
      ...prev,
      { id: `u${now}`, from: 'user', text: q },
      { id: `h${now}`, from: 'henry', ...reply },
    ])
    setInput('')
    speak(reply.text)
    requestAnimationFrame(() => list.current?.scrollToEnd({ animated: true }))
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Background />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.header}>
          <HenryOrb size={44} active={app.speaking} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Henry</Text>
            <Text style={styles.subtitle}>{app.speaking ? 'Falando…' : 'Assistente do seu Ford'}</Text>
          </View>
          <Pressable
            onPress={() => {
              tap()
              if (app.speaking) stopSpeaking()
              app.toggleVoice()
            }}
            accessibilityRole="switch"
            accessibilityState={{ checked: app.voiceEnabled }}
            accessibilityLabel="Voz do Henry"
            hitSlop={8}
          >
            <Ionicons name={app.voiceEnabled ? 'volume-high-outline' : 'volume-mute-outline'} size={24} color={colors.periwinkle} />
          </Pressable>
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <FlatList
            ref={list}
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
            onContentSizeChange={() => list.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <View style={[styles.bubble, item.from === 'user' ? styles.user : styles.henry]}>
                <Text style={styles.bubbleText}>{item.text}</Text>
                {item.action && (
                  <Pressable
                    onPress={() => {
                      tap()
                      router.push(item.action!.href)
                    }}
                    style={styles.action}
                    accessibilityRole="button"
                  >
                    <Text style={styles.actionText}>{item.action.label}</Text>
                    <Ionicons name="arrow-forward" size={16} color={colors.periwinkle} />
                  </Pressable>
                )}
              </View>
            )}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
            style={{ flexGrow: 0, marginBottom: spacing.sm }}
            keyboardShouldPersistTaps="handled"
          >
            {suggestions.map((s) => (
              <Pressable key={s} onPress={() => send(s)} style={styles.chip} accessibilityRole="button">
                <Text style={styles.chipText}>{s}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Pergunte ao Henry…"
              placeholderTextColor={colors.textFaint}
              style={styles.input}
              returnKeyType="send"
              onSubmitEditing={() => send(input)}
              accessibilityLabel="Mensagem para o Henry"
            />
            <Pressable
              onPress={() => send(input)}
              style={[styles.send, !input.trim() && { opacity: 0.5 }]}
              disabled={!input.trim()}
              accessibilityRole="button"
              accessibilityLabel="Enviar"
            >
              <Ionicons name="send" size={20} color={colors.white} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { color: colors.text, fontSize: 18, fontWeight: '800' },
  subtitle: { color: colors.textFaint, fontSize: 13 },
  bubble: { maxWidth: '86%', padding: spacing.md, borderRadius: radius.lg },
  henry: { alignSelf: 'flex-start', backgroundColor: colors.cardStrong, borderTopLeftRadius: 6 },
  user: { alignSelf: 'flex-end', backgroundColor: colors.blue, borderTopRightRadius: 6 },
  bubbleText: { color: colors.text, fontSize: 15, lineHeight: 21 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm },
  actionText: { color: colors.periwinkle, fontWeight: '700' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.periwinkle + '55',
    backgroundColor: colors.periwinkle + '14',
  },
  chipText: { color: colors.periwinkle, fontWeight: '600', fontSize: 13 },
  inputRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  input: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    fontSize: 15,
  },
  send: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
