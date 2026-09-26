import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Speech from 'expo-speech'
import { screen, waitFor } from 'expo-router/testing-library'
import type { Booking } from '@/store/AppContext'
import { confirmNextAlert, openLoggedIn, press, pressLabel, readStored } from './helpers'

beforeEach(async () => {
  await AsyncStorage.clear()
  jest.clearAllMocks()
})

async function simularBateria() {
  press('Simular evento')
  pressLabel(/Simular Bateria/)
  expect(await screen.findByText('Identifiquei sinais de degradação na bateria. Quer que eu explique?')).toBeTruthy()
}

async function agendar(concessionaria: string, dia: string, hora: string) {
  expect(await screen.findByText('Escolha a concessionária')).toBeTruthy()
  press(concessionaria)
  press('Continuar')
  expect(await screen.findByText('Escolha data e horário')).toBeTruthy()
  press(dia)
  press(hora)
}

describe('fluxo Henry → agendamento', () => {
  it('Henry avisa, explica por voz e agenda na rede Ford', async () => {
    await openLoggedIn()
    await simularBateria()
    expect(Speech.speak).toHaveBeenCalledWith(
      'Identifiquei sinais de degradação na bateria. Quer que eu explique?',
      expect.objectContaining({ language: 'pt-BR' })
    )

    press('Sim, explicar')
    expect(await screen.findByText('Prioridade Alta')).toBeTruthy()
    expect(screen.getByText('84%')).toBeTruthy()
    expect(screen.getByText('Agendar uma verificação da bateria.')).toBeTruthy()
    expect(Speech.speak).toHaveBeenLastCalledWith(
      expect.stringContaining('bateria está com sinais de desgaste'),
      expect.anything()
    )

    press('Agendar serviço Ford')
    await agendar('Ford Norte', 'Amanhã', '14:00')
    press('Confirmar agendamento')

    expect(await screen.findByText('Agendamento confirmado')).toBeTruthy()
    expect(screen.getByText('Verificação da bateria')).toBeTruthy()
    expect(screen.getByText('Ciclos de carga da bateria')).toBeTruthy()

    const saved = await readStored<Booking[]>('bookings')
    expect(saved).toHaveLength(1)
    expect(saved?.[0]).toMatchObject({ dealershipId: 'norte', time: '14:00', status: 'scheduled', scenarioId: 'battery' })

    press('Ver meus agendamentos')
    expect(await screen.findByText('Agendamentos')).toBeTruthy()
    expect(screen.getByText('Ford Norte')).toBeTruthy()
  })

  it('não deixa avançar sem escolher concessionária e horário', async () => {
    await openLoggedIn('/schedule/dealership')
    expect(await screen.findByText('Escolha a concessionária')).toBeTruthy()
    const continuar = screen.getByRole('button', { name: 'Continuar' })
    expect(continuar).toBeDisabled()
    press('Ford Leste')
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeEnabled()
    press('Continuar')
    expect(await screen.findByText('Escolha data e horário')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Confirmar agendamento' })).toBeDisabled()
    press('Amanhã')
    expect(screen.getByRole('button', { name: 'Confirmar agendamento' })).toBeDisabled()
    press('08:00')
    expect(screen.getByRole('button', { name: 'Confirmar agendamento' })).toBeEnabled()
  })

  it('agendamento sem alerta ativo vira revisão preventiva', async () => {
    await openLoggedIn('/schedule/dealership')
    await agendar('Ford Center São Paulo', 'Hoje', '09:40')
    press('Confirmar agendamento')
    expect(await screen.findByText('Agendamento confirmado')).toBeTruthy()
    expect(screen.getByText('Revisão preventiva')).toBeTruthy()
  })
})

describe('CRUD de agendamentos', () => {
  async function criarAgendamento() {
    await openLoggedIn()
    await simularBateria()
    press('Sim, explicar')
    await screen.findByText('Agendar serviço Ford')
    press('Agendar serviço Ford')
    await agendar('Ford Norte', 'Amanhã', '14:00')
    press('Confirmar agendamento')
    await screen.findByText('Agendamento confirmado')
    press('Ver meus agendamentos')
    await screen.findByText('Agendamentos')
    pressLabel(/Verificação da bateria/)
    expect(await screen.findByText('Reagendar')).toBeTruthy()
  }

  it('reagenda (update) mantendo o mesmo registro', async () => {
    await criarAgendamento()
    const antes = (await readStored<Booking[]>('bookings'))![0]

    press('Reagendar')
    await agendar('Ford Leste', 'Hoje', '16:30')
    press('Salvar novo horário')
    expect(await screen.findByText('Agendamento confirmado')).toBeTruthy()

    const depois = await readStored<Booking[]>('bookings')
    expect(depois).toHaveLength(1)
    expect(depois![0]).toMatchObject({ id: antes.id, dealershipId: 'leste', time: '16:30', status: 'scheduled' })
  })

  it('cancela e depois exclui do histórico', async () => {
    await criarAgendamento()
    confirmNextAlert()
    press('Cancelar agendamento')
    expect(await screen.findByText('Cancelado')).toBeTruthy()
    await waitFor(async () => expect((await readStored<Booking[]>('bookings'))![0].status).toBe('cancelled'))

    confirmNextAlert()
    press('Excluir do histórico')
    await waitFor(async () => expect(await readStored<Booking[]>('bookings')).toEqual([]))
  })

  it('concluir o serviço resolve o alerta e registra manutenção oficial', async () => {
    await criarAgendamento()
    press('Marcar como concluído (demo)')
    expect(await screen.findByText('Concluído')).toBeTruthy()

    await waitFor(async () => {
      const m = await readStored<{ label: string; network: string; scoreAfter: number }[]>('maintenance')
      expect(m![0]).toMatchObject({ label: 'Verificação da bateria', network: 'official', scoreAfter: 93 })
    })
    const demo = await readStored<{ hasRecommendation: boolean; scoreOverride: number }>('demo')
    expect(demo).toMatchObject({ hasRecommendation: false, scoreOverride: 93 })
  })
})
