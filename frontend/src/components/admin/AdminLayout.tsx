import { ChartBar, Chats, List, Package, Ruler, SignOut, SquaresFour, Stack, Storefront, Tag, UsersThree, X } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link, Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthProvider'

const links = [
  { to: '/admin', label: 'Overview', icon: SquaresFour, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/collections', label: 'Collections', icon: Stack },
  { to: '/admin/sizes', label: 'Sizes', icon: Ruler },
  { to: '/admin/users', label: 'Users', icon: UsersThree },
  { to: '/admin/orders', label: 'Orders', icon: Storefront },
  { to: '/admin/chats', label: 'Chats', icon: Chats },
  { to: '/admin/analytics', label: 'Analytics', icon: ChartBar },
]

export function AdminLayout() {
  const { user, loading, logout } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  if (loading) return <div className="admin-gate">Checking admin access...</div>
  if (!user) return <Navigate to="/auth" state={{ from: location.pathname }} replace />
  if (user.role !== 'admin') return <Navigate to="/account" replace />

  return <div className="admin-app">
    <aside className={`admin-sidebar ${open ? 'is-open' : ''}`}>
      <div className="admin-brand"><Link to="/admin"><img src="/logos/sportbuk.png" alt="SPORTBUK" /></Link><button type="button" aria-label="Close menu" onClick={() => setOpen(false)}><X size={22} /></button></div>
      <p className="admin-kicker">Operations</p>
      <nav>{links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}><Icon size={20} /><span>{label}</span></NavLink>)}</nav>
      <div className="admin-profile"><div><strong>{user.fullName}</strong><span>Administrator</span></div><button type="button" aria-label="Sign out" title="Sign out" onClick={() => void logout()}><SignOut size={20} /></button></div>
    </aside>
    {open && <button className="admin-backdrop" type="button" aria-label="Close menu" onClick={() => setOpen(false)} />}
    <main className="admin-main"><header className="admin-topbar"><button type="button" aria-label="Open menu" onClick={() => setOpen(true)}><List size={22} /></button><span>SPORTBUK ADMIN</span><Link to="/">View store <Storefront size={18} /></Link></header><Outlet /></main>
  </div>
}
