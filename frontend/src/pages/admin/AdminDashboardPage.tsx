import { ArrowRight, CurrencyDollar, Package, ShoppingBag, UsersThree } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthProvider'
import { useApi } from '../../hooks/useApi'
import { formatPrice } from '../../lib/format'

interface Stats { revenue: number; orders: number; customers: number; products: number }
interface Order { _id: string; orderCode: string; totalAmount: number; orderStatus: string; createdAt: string; user?: { fullName?: string } }

export function AdminDashboardPage() {
  const { token } = useAuth()
  const { data: stats, loading, error } = useApi<Stats>('/dashboard/stats', token)
  const { data: orders } = useApi<Order[]>('/orders/admin/all', token)
  const cards = [
    ['Revenue', formatPrice(stats?.revenue || 0), CurrencyDollar],
    ['Orders', String(stats?.orders || 0), ShoppingBag],
    ['Customers', String(stats?.customers || 0), UsersThree],
    ['Active products', String(stats?.products || 0), Package],
  ] as const
  return <AdminPage title="Command center" description="Store performance and latest order activity.">
    {error && <AdminError message={error} />}
    <section className="admin-stat-grid">{cards.map(([label, value, Icon]) => <article key={label}><Icon size={22} /><span>{label}</span><strong>{loading ? '...' : value}</strong></article>)}</section>
    <section className="admin-panel"><div className="admin-panel-head"><div><h2>Recent orders</h2><p>Latest paid or cash-on-delivery orders.</p></div><Link to="/admin/orders">Manage orders <ArrowRight size={17} /></Link></div><div className="admin-table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th><th>Date</th></tr></thead><tbody>{orders?.slice(0, 6).map((order) => <tr key={order._id}><td><strong>{order.orderCode}</strong></td><td>{order.user?.fullName || 'Customer'}</td><td><Status value={order.orderStatus} /></td><td>{formatPrice(order.totalAmount)}</td><td>{new Date(order.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div>{!orders?.length && <AdminEmpty message="No orders yet." />}</section>
  </AdminPage>
}

export function AdminPage({ title, description, action, children }: { title: string; description: string; action?: React.ReactNode; children: React.ReactNode }) {
  return <div className="admin-page"><div className="admin-page-head"><div><h1>{title}</h1><p>{description}</p></div>{action}</div>{children}</div>
}

export function Status({ value }: { value: string | boolean }) {
  const text = typeof value === 'boolean' ? value ? 'Active' : 'Inactive' : value
  return <span className={`admin-status admin-status-${String(text).toLowerCase()}`}>{text}</span>
}

export function AdminError({ message }: { message: string }) { return <p className="admin-alert" role="alert">{message}</p> }
export function AdminEmpty({ message }: { message: string }) { return <div className="admin-empty">{message}</div> }
