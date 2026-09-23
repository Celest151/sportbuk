import { WarningCircle } from '@phosphor-icons/react'

export function LoadingGrid() {
  return <div className="product-grid" aria-label="Loading products">{Array.from({ length: 6 }, (_, index) => <div className="skeleton product-skeleton" key={index} />)}</div>
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return <div className="empty-state"><h2>{title}</h2><p>{message}</p></div>
}

export function ErrorState({ message }: { message: string }) {
  return <div className="error-state" role="alert"><WarningCircle size={24} weight="bold" /><div><strong>Could not load this page</strong><p>{message}</p></div></div>
}
