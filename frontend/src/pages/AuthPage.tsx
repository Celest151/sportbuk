import { Eye, EyeSlash } from '@phosphor-icons/react'
import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ApiError } from '../lib/api'
import { useAuth } from '../features/auth/AuthProvider'

export function AuthPage() {
  const [searchParams] = useSearchParams()
  const requestedMode = searchParams.get('mode') === 'register' ? 'register' : 'login'
  const [mode, setMode] = useState<'login' | 'register'>(requestedMode)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setMode(requestedMode)
  }, [requestedMode])

  if (user) return <Navigate to="/account" replace />

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    const values = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>
    try {
      if (mode === 'login') await login({ email: values.email, password: values.password })
      else await register({ fullName: values.fullName, phone: values.phone, email: values.email, password: values.password, confirmPassword: values.confirmPassword })
      const destination = (location.state as { from?: string } | null)?.from || '/account'
      navigate(destination, { replace: true })
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : 'Could not complete sign in.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page page-shell page-top">
      <div className="auth-image"><img src="/images/football/tunnel.png" alt="Football player walking toward the pitch" /></div>
      <div className="auth-panel"><div className="auth-tabs"><button className={mode === 'login' ? 'active' : ''} type="button" onClick={() => setMode('login')}>Sign in</button><button className={mode === 'register' ? 'active' : ''} type="button" onClick={() => setMode('register')}>Register</button></div><h1>{mode === 'login' ? 'Welcome back.' : 'Join the squad.'}</h1><p>{mode === 'login' ? 'Sign in to manage saved gear and your training bag.' : 'Create an account to keep your football picks together.'}</p>
        <form onSubmit={submit}>
          {mode === 'register' && <><div className="field"><label htmlFor="fullName">Full name</label><input id="fullName" name="fullName" autoComplete="name" minLength={2} required /></div><div className="field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" autoComplete="tel" required /></div></>}
          <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
          <div className="field"><label htmlFor="password">Password</label><div className="password-field"><input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} required /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((shown) => !shown)}>{showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}</button></div></div>
          {mode === 'register' && <div className="field"><label htmlFor="confirmPassword">Confirm password</label><input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={6} required /></div>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark" type="submit" disabled={submitting}>{submitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
        </form>
      </div>
    </div>
  )
}
