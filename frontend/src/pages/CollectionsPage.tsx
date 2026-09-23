import { ArrowRight } from '@phosphor-icons/react'
import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '../components/catalog/ProductCard'
import { EmptyState, ErrorState, LoadingGrid } from '../components/ui/PageState'
import { ProductImage } from '../components/ui/ProductImage'
import { useApi } from '../hooks/useApi'
import type { Collection } from '../types'

export function CollectionsPage() {
  const { data, loading, error } = useApi<Collection[]>('/collections')
  return <div className="page-shell page-top"><div className="page-intro"><h1>Football collections</h1><p>Complete kit stories built around matchday roles and training demands.</p></div>{loading && <LoadingGrid />}{error && <ErrorState message={error} />}<div className="collection-grid">{data?.map((item) => <Link className="collection-card" to={`/collections/${item.slug}`} key={item._id}><ProductImage src={item.image} alt={item.name} seed={item.slug} /><span><strong>{item.name}</strong><small>{item.description}</small><b>{item.productCount} products <ArrowRight size={16} /></b></span></Link>)}</div></div>
}

export function CollectionPage() {
  const { slug } = useParams()
  const { data, loading, error } = useApi<Collection>(slug ? `/collections/${slug}` : null)
  if (loading) return <div className="page-shell page-top"><LoadingGrid /></div>
  if (error || !data) return <div className="page-shell page-top"><ErrorState message={error || 'Collection not found.'} /></div>
  return <div className="page-shell page-top"><div className="collection-hero"><ProductImage src={data.image} alt={data.name} seed={data.slug} /><div><h1>{data.name}</h1><p>{data.description}</p></div></div><section className="section"><h2>Inside the collection</h2>{data.products?.length ? <div className="product-grid">{data.products.map((product) => <ProductCard product={product} key={product._id} />)}</div> : <EmptyState title="Collection coming soon" message="Products will appear here when the squad is ready." />}</section></div>
}
