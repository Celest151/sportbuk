import { Heart } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useShop } from '../../features/shop/ShopProvider'
import { formatPrice, productPrice } from '../../lib/format'
import type { Product } from '../../types'
import { ProductImage } from '../ui/ProductImage'

export function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted } = useShop()
  const saved = isWishlisted(product._id)

  return (
    <article className="product-card">
      <div className="product-media">
        <Link to={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
          <ProductImage src={product.image} alt={product.name} seed={product.slug} />
        </Link>
        <button className="icon-button product-save" type="button" aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'} onClick={() => void toggleWishlist(product)}>
          <Heart size={21} weight={saved ? 'fill' : 'regular'} />
        </button>
      </div>
      <div className="product-meta">
        <div>
          <Link className="product-name" to={`/products/${product.slug}`}>{product.name}</Link>
          <p>{typeof product.category === 'object' && product.category ? product.category.name : 'Football gear'}</p>
        </div>
      </div>
      <div className="price-row">
        <strong className={product.discount > 0 ? 'sale-price' : ''}>{formatPrice(productPrice(product))}</strong>
        {product.discount > 0 && <span>{formatPrice(product.price)}</span>}
      </div>
    </article>
  )
}
