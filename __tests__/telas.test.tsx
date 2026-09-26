import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Speech from 'expo-speech'
import { fireEvent, screen } from 'expo-router/testing-library'
import { openLoggedIn, press, pressLabel } from './helpers'

beforeEach(async () => {
  await AsyncStorage.clear()
  jest.clearAllMocks()
})

describe('abas', () => {
  it('navega por todas as abas', async () => {
    await openLoggedIn()
    expect(screen.getByText('Saúde do veículo')).toBeTruthy()

    press('Veículo')
    expect(await screen.findByText('Ford Ranger')).toBeTruthy()
    expect(screen.getByText('Sistemas')).toBeTruthy()

    press('Henry')
    expect(await screen.findByText('Assistente do seu Ford')).toBeTruthy()

    press('Agenda')
    expect(await screen.findByText('Nenhum agendamento ativo')).toBeTruthy()

    press('Perfil')
    expect(await screen.findByText('pedro@ford.com')).toBeTruthy()
  })
})

describe('cenários do Henry', () => {
  it('saúde normal não gera alerta e informa que está tudo certo', async () => {
    await openLoggedIn('/demo')
    pressLabel(/Simular Saúde normal/)
    expect(await screen.findByText('Verifiquei os sistemas do seu veículo e está tudo dentro do esperado.')).toBeTruthy()
    press('Ver detalhes')
    expect(await screen.findByText('Seu veículo está saudável')).toBeTruthy()
    expect(screen.queryByText('Agendar serviço Ford')).toBeNull()
    press('Entendi')
    expect(await screen.findByText('Monitoramento ativo')).toBeTruthy()
    expect(screen.getByText('94')).toBeTruthy()
  })

  it('"Agora não" fecha o aviso e mantém a recomendação na Home', async () => {
    await openLoggedIn('/demo')
    pressLabel(/Simular Freios/)
    await screen.findByText('Agora não')
    press('Agora não')
    expect(await screen.findByText('Henry recomenda uma inspeção')).toBeTruthy()
    expect(screen.getByText('Sistema de frenagem · Prioridade Média')).toBeTruthy()
    expect(screen.getByText('72')).toBeTruthy()
  })
})

describe('assistente Henry', () => {
  it('responde perguntas e fala a resposta', async () => {
    await openLoggedIn('/henry')
    fireEvent.changeText(await screen.findByLabelText('Mensagem para o Henry'), 'Quanto vale meu carro?')
    pressLabel('Enviar')
    expect(await screen.findByText(/valor de revenda estimado do seu Ford é R\$ 246\.200/)).toBeTruthy()
    expect(Speech.speak).toHaveBeenCalled()

    press('Como está meu carro?')
    expect(await screen.findByText(/Health Score está em 87/)).toBeTruthy()
  })

  it('desliga a voz do Henry', async () => {
    await openLoggedIn('/henry')
    pressLabel('Voz do Henry')
    press('Agendar um serviço')
    expect(await screen.findByText(/Posso agendar na rede Ford agora/)).toBeTruthy()
    expect(Speech.speak).not.toHaveBeenCalled()
  })
})
