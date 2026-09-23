import { createContext, useContext, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { apiRequest } from '../../lib/api'
import type { User } from '../../types'

interface Credentials {
  email: string
  password: string
}

interface Registration extends Credentials {
  fullName: string
  confirmPassword: string
  phone: string
}

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

interface AuthContextValue {
  user: User | null
  token: string | null
  loading: boolean
  login: (values: Credentials) => Promise<void>
  register: (values: Registration) => Promise<void>
  logout: () => Promise<void>
}

const TOKEN_KEY = 'sportbuk_auth'
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthResponse | null>(() => {
    try {
      return JSON.parse(localStorage.getItem(TOKEN_KEY) || 'null') as AuthResponse | null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(Boolean(session?.accessToken))

  useEffect(() => {
    if (!session?.accessToken) return
    apiRequest<{ user: User }>('/auth/profile', {}, session.accessToken)
      .then(({ user }) => setSession((current) => (current ? { ...current, user } : null)))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setSession(null)
      })
      .finally(() => setLoading(false))
  }, [session?.accessToken])

  async function authenticate(path: string, values: Credentials | Registration) {
    const next = await apiRequest<AuthResponse>(path, { method: 'POST', body: JSON.stringify(values) })
    localStorage.setItem(TOKEN_KEY, JSON.stringify(next))
    setSession(next)
  }

  async function logout() {
    if (session?.accessToken) {
      await apiRequest('/auth/logout', { method: 'POST' }, session.accessToken).catch(() => undefined)
    }
    localStorage.removeItem(TOKEN_KEY)
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        token: session?.accessToken ?? null,
        loading,
        login: (values) => authenticate('/auth/login', values),
        register: (values) => authenticate('/auth/register', values),
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export type AuthFormEvent = FormEvent<HTMLFormElement>
