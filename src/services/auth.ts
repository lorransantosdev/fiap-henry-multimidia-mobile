export interface Session {
  name: string
  email: string
  loggedAt: string
}

export const DEMO_USER = {
  name: 'Pedro',
  email: 'pedro@ford.com',
  password: 'henry123',
}

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin(email: string, password: string) {
  const errors: { email?: string; password?: string } = {}
  if (!email.trim()) errors.email = 'Informe seu e-mail.'
  else if (!EMAIL_RX.test(email.trim())) errors.email = 'E-mail inválido.'
  if (!password) errors.password = 'Informe sua senha.'
  else if (password.length < 6) errors.password = 'A senha deve ter ao menos 6 caracteres.'
  return errors
}

export async function signIn(email: string, password: string): Promise<Session> {
  await new Promise((r) => setTimeout(r, 700))
  const normalized = email.trim().toLowerCase()
  if (normalized !== DEMO_USER.email || password !== DEMO_USER.password) {
    throw new Error('E-mail ou senha incorretos.')
  }
  return { name: DEMO_USER.name, email: normalized, loggedAt: new Date().toISOString() }
}
