import { SignOut, UserCircle } from '@phosphor-icons/react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthProvider'

export function AccountPage() {
  const { user, loading, logout } = useAuth()
  if (loading) return <div className="page-shell page-top"><div className="skeleton account-skeleton" /></div>
  if (!user) return <Navigate to="/auth" replace state={{ from: '/account' }} />
  return <div className="page-shell page-top account-page"><div className="account-heading"><UserCircle size={64} weight="thin" /><div><h1>{user.fullName}</h1><p>{user.email}</p></div></div><dl><div><dt>Phone</dt><dd>{user.phone || 'Not provided'}</dd></div><div><dt>Account type</dt><dd>SPORTBUK member</dd></div></dl><button className="button button-soft" type="button" onClick={() => void logout()}><SignOut size={19} /> Sign out</button></div>
}
