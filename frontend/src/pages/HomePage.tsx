import { ArrowRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/catalog/ProductCard'
import { HeroSlideshow } from '../components/home/HeroSlideshow'
import { ErrorState, LoadingGrid } from '../components/ui/PageState'
import { ProductImage } from '../components/ui/ProductImage'
import { useApi } from '../hooks/useApi'
import type { Collection, Product } from '../types'

export function HomePage() {
  const products = useApi<Product[]>('/products/featured?limit=4')
  const collections = useApi<Collection[]>('/collections?featured=true&limit=2')

  return (
    <>
      <HeroSlideshow />

      <section className="section page-shell">
        <div className="section-heading"><h2>Fresh for the pitch</h2><Link className="text-link" to="/products">Shop all <ArrowRight size={17} /></Link></div>
        {products.loading && <LoadingGrid />}
        {products.error && <ErrorState message={products.error} />}
        {products.data && <div className="product-grid">{products.data.map((product) => <ProductCard product={product} key={product._id} />)}</div>}
      </section>

      <section className="section page-shell collection-feature">
        <h2>Pick a side of the game</h2>
        {collections.data?.map((collection) => (
          <Link className="campaign-tile" to={`/collections/${collection.slug}`} key={collection._id}>
            <ProductImage src={collection.image} alt={collection.name} seed={collection.slug} />
            <span><strong>{collection.name}</strong><small>{collection.description}</small></span>
          </Link>
        ))}
      </section>

      <section className="section journal-promo page-shell">
        <div><h2>Know your kit.</h2><p>Fit checks, care advice, and practical football guides from the SPORTBUK journal.</p><Link className="button button-light" to="/journal">Read the journal</Link></div>
        <img src="/images/football/locker.png" alt="Football kit prepared in a locker room" loading="lazy" />
      </section>
    </>
  )
}
