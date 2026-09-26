import AsyncStorage from '@react-native-async-storage/async-storage'
import { fireEvent, screen, waitFor } from 'expo-router/testing-library'
import { openLoggedIn, press, pressLabel, readStored } from './helpers'

beforeEach(async () => {
  await AsyncStorage.clear()
})

describe('selo de manutenção oficial', () => {
  it('começa ativo com todo o histórico na rede Ford', async () => {
    await openLoggedIn('/maintenance')
    expect(await screen.findByText('Selo oficial ativo')).toBeTruthy()
    expect(screen.getByText('3 na rede · 0 fora da rede · 100%')).toBeTruthy()
    expect(screen.getByText('Revenda estimada: R$ 246.200')).toBeTruthy()
  })

  it('valida o formulário de nova manutenção', async () => {
    await openLoggedIn('/maintenance/new')
    press('Salvar registro')
    expect(await screen.findByText('Descreva o serviço (mín. 3 caracteres).')).toBeTruthy()
    expect(screen.getByText('Selecione o sistema.')).toBeTruthy()
  })

  it('serviço fora da rede pausa o selo e reduz a revenda; serviço oficial reativa', async () => {
    await openLoggedIn('/maintenance')
    press('Registrar manutenção')
    fireEvent.changeText(await screen.findByLabelText('Descrição do serviço'), 'Troca de pastilhas')
    press('Freios')
    press('Oficina externa')
    press('Salvar registro')
    expect(await screen.findByText('Informe a oficina.')).toBeTruthy()
    fireEvent.changeText(screen.getByLabelText('Nome da oficina'), 'Auto Center X')
    press('Salvar registro')

    expect(await screen.findByText('Selo de Manutenção Oficial pausado')).toBeTruthy()
    expect(screen.getByText('R$ 227.800')).toBeTruthy()

    await waitFor(async () => {
      const m = await readStored<{ network: string; dealership: string }[]>('maintenance')
      expect(m![0]).toMatchObject({ network: 'off', dealership: 'Auto Center X' })
    })

    press('Entendi')
    expect(await screen.findByText('Selo pausado')).toBeTruthy()

    press('Registrar manutenção')
    fireEvent.changeText(await screen.findByLabelText('Descrição do serviço'), 'Revisão de freios')
    press('Freios')
    press('Salvar registro')
    expect(await screen.findByText('Selo oficial ativo')).toBeTruthy()
    expect(screen.getByText('4 na rede · 1 fora da rede · 80%')).toBeTruthy()
    expect(screen.getByText('Revenda estimada: R$ 242.000')).toBeTruthy()
  })

  it('reparo detectado pelo Henry (modo apresentação) pausa o selo', async () => {
    await openLoggedIn('/demo')
    pressLabel('Simular reparo fora da rede')
    expect(await screen.findByText('Manutenção fora da rede')).toBeTruthy()
    expect(screen.getByText(/Health Score 87 → 91/)).toBeTruthy()
  })
})
