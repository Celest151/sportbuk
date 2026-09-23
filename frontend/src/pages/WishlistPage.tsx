import { HeartBreak, ShoppingBag } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/PageState'
import { ProductImage } from '../components/ui/ProductImage'
import { useShop } from '../features/shop/ShopProvider'
import { formatPrice } from '../lib/format'
import type { Product } from '../types'

export function WishlistPage() {
  const { wishlist, toggleWishlist, addToBag } = useShop()
  if (!wishlist.length) return <div className="page-shell page-top"><EmptyState title="Your wishlist is open" message="Save football gear while browsing and it will appear here." /><div className="center-action"><Link className="button button-dark" to="/products">Browse football gear</Link></div></div>
  return <div className="page-shell page-top"><div className="page-intro"><h1>Wishlist</h1><p>{wishlist.length} saved {wishlist.length === 1 ? 'item' : 'items'}</p></div><div className="saved-list">{wishlist.map((item) => { const product: Product = { _id: item.productId, slug: item.slug, name: item.name, image: item.image, description: '', price: item.originalPrice, finalPrice: item.price, discount: 0, stock: 1 }; return <article key={item.productId}><Link to={`/products/${item.slug}`}><ProductImage src={item.image} alt={item.name} seed={item.slug} /></Link><div><Link className="product-name" to={`/products/${item.slug}`}>{item.name}</Link><p>{item.color} / {item.size}</p><strong>{formatPrice(item.price)}</strong><div><button className="button button-dark" type="button" onClick={() => void addToBag(product, item.size, item.color)}><ShoppingBag size={18} /> Add to bag</button><button className="button button-soft" type="button" onClick={() => void toggleWishlist(product)}><HeartBreak size={18} /> Remove</button></div></div></article> })}</div></div>
}
