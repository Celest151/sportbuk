import { Minus, Plus, Trash } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/PageState'
import { ProductImage } from '../components/ui/ProductImage'
import { useShop } from '../features/shop/ShopProvider'
import { formatPrice } from '../lib/format'

export function BagPage() {
  const { bag, removeFromBag, updateBagQuantity } = useShop()
  const [updatingKey, setUpdatingKey] = useState('')
  const total = bag.reduce((sum, item) => sum + item.price * item.quantity * (1 - item.discount / 100), 0)

  async function changeQuantity(item: (typeof bag)[number], quantity: number) {
    const key = `${item.product._id}-${item.selectedSize}-${item.selectedColor}`
    setUpdatingKey(key)
    await updateBagQuantity(item, quantity)
    setUpdatingKey('')
  }

  async function removeItem(item: (typeof bag)[number]) {
    const key = `${item.product._id}-${item.selectedSize}-${item.selectedColor}`
    setUpdatingKey(key)
    await removeFromBag(item)
    setUpdatingKey('')
  }

  if (!bag.length) return <div className="page-shell page-top"><EmptyState title="Your training bag is empty" message="Add the gear you need for your next session." /><div className="center-action"><Link className="button button-dark" to="/products">Find football gear</Link></div></div>
  return <div className="page-shell page-top bag-layout"><section><div className="page-intro"><h1>Training bag</h1><p>{bag.length} product {bag.length === 1 ? 'line' : 'lines'}</p></div><div className="saved-list">{bag.map((item) => {
    const key = `${item.product._id}-${item.selectedSize}-${item.selectedColor}`
    const variantStock = item.product.variants?.find((variant) => variant.size === item.selectedSize && variant.color === item.selectedColor)?.stock
    const stock = variantStock ?? item.product.stock
    const maxQuantity = stock > 0 ? stock : item.quantity
    const isUpdating = updatingKey === key
    return <article key={key}><Link to={`/products/${item.product.slug}`}><ProductImage src={item.product.image} alt={item.product.name} seed={item.product.slug} /></Link><div><Link className="product-name" to={`/products/${item.product.slug}`}>{item.product.name}</Link><p>{item.selectedColor} / {item.selectedSize}</p><strong>{formatPrice(item.price * item.quantity * (1 - item.discount / 100))}</strong><div className="bag-item-actions"><div className="bag-quantity" aria-label={`Quantity for ${item.product.name}`}><button type="button" aria-label={item.quantity === 1 ? 'Remove item' : 'Decrease quantity'} disabled={isUpdating} onClick={() => void (item.quantity === 1 ? removeItem(item) : changeQuantity(item, item.quantity - 1))}>{item.quantity === 1 ? <Trash size={17} /> : <Minus size={15} weight="bold" />}</button><output aria-live="polite">{item.quantity}</output><button type="button" aria-label="Increase quantity" disabled={isUpdating || item.quantity >= maxQuantity} onClick={() => void changeQuantity(item, item.quantity + 1)} title={item.quantity >= maxQuantity ? 'Maximum available stock reached' : undefined}><Plus size={15} weight="bold" /></button></div></div></div></article>
  })}</div></section><aside className="bag-summary"><h2>Bag summary</h2><div><span>Products</span><strong>{formatPrice(total)}</strong></div><p>Checkout is not part of the active SPORTBUK catalog. Use this bag to plan your training setup.</p><Link className="button button-dark" to="/products">Continue browsing</Link></aside></div>
}
