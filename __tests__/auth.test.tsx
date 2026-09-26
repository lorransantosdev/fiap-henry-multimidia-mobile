import AsyncStorage from '@react-native-async-storage/async-storage'
import { fireEvent, screen, waitFor } from 'expo-router/testing-library'
import { confirmNextAlert, openApp, openLoggedIn, press, readStored } from './helpers'

beforeEach(async () => {
  await AsyncStorage.clear()
})

describe('login', () => {
  it('valida os campos obrigatórios', async () => {
    await openApp()
    press('Entrar')
    expect(await screen.findByText('Informe seu e-mail.')).toBeTruthy()
    expect(screen.getByText('Informe sua senha.')).toBeTruthy()
  })

  it('valida formato de e-mail e tamanho da senha', async () => {
    await openApp()
    fireEvent.changeText(await screen.findByLabelText('E-mail'), 'pedro@')
    fireEvent.changeText(screen.getByLabelText('Senha'), '123')
    press('Entrar')
    expect(await screen.findByText('E-mail inválido.')).toBeTruthy()
    expect(screen.getByText('A senha deve ter ao menos 6 caracteres.')).toBeTruthy()
  })

  it('recusa senha incorreta', async () => {
    await openApp()
    fireEvent.changeText(await screen.findByLabelText('E-mail'), 'pedro@ford.com')
    fireEvent.changeText(screen.getByLabelText('Senha'), 'errada1')
    press('Entrar')
    expect(await screen.findByText('E-mail ou senha incorretos.', {}, { timeout: 3000 })).toBeTruthy()
    expect(await readStored('session')).toBeNull()
  })

  it('entra com a conta demo e salva a sessão', async () => {
    await openApp()
    press('Usar conta de demonstração')
    press('Entrar')
    expect(await screen.findByText('Olá, Pedro', {}, { timeout: 3000 })).toBeTruthy()
    await waitFor(async () => expect(await readStored('session')).toMatchObject({ email: 'pedro@ford.com' }))
  })

  it('reabre o app já logado quando existe sessão', async () => {
    await openLoggedIn()
    expect(screen.getByText('Olá, Pedro')).toBeTruthy()
    expect(screen.queryByText('Usar conta de demonstração')).toBeNull()
  })

  it('sai da conta pelo perfil', async () => {
    await openLoggedIn('/profile')
    confirmNextAlert()
    press('Sair')
    expect(await screen.findByText('Usar conta de demonstração')).toBeTruthy()
    expect(await readStored('session')).toBeNull()
  })
})
