import { Faders, X } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/catalog/ProductCard'
import { EmptyState, ErrorState, LoadingGrid } from '../components/ui/PageState'
import { SelectField } from '../components/ui/SelectField'
import { useApi } from '../hooks/useApi'
import { formatPrice } from '../lib/format'
import type { Category, Product } from '../types'

const PRICE_STEP = 50000

export function ShopPage() {
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const search = params.get('search') || ''
  const category = params.get('category') || ''
  const sort = params.get('sort') || ''
  const minPrice = params.get('minPrice') || ''
  const maxPrice = params.get('maxPrice') || ''
  const query = new URLSearchParams({ limit: '100' })
  if (search) query.set('search', search)
  if (category) query.set('category', category)
  if (sort) query.set('sort', sort)
  if (minPrice) query.set('minPrice', minPrice)
  if (maxPrice) query.set('maxPrice', maxPrice)
  const products = useApi<Product[]>(`/products?${query}`)
  const fullCatalog = useApi<Product[]>('/products?limit=100')
  const categories = useApi<Category[]>('/categories')
  const priceCeiling = Math.max(2000000, Math.ceil(Math.max(...(fullCatalog.data || []).map((product) => product.maxCurrentPrice || product.finalPrice || product.price), 0) / 100000) * 100000)
  const selectedMin = Math.min(Number(minPrice) || 0, priceCeiling - PRICE_STEP)
  const selectedMax = Math.max(selectedMin + PRICE_STEP, Math.min(Number(maxPrice) || priceCeiling, priceCeiling))
  const [draftPrice, setDraftPrice] = useState({ min: selectedMin, max: selectedMax })

  useEffect(() => {
    setDraftPrice({ min: selectedMin, max: selectedMax })
  }, [selectedMin, selectedMax])

  useEffect(() => {
    if (draftPrice.min === selectedMin && draftPrice.max === selectedMax) return
    const timer = window.setTimeout(() => {
      setParams((current) => {
        const next = new URLSearchParams(current)
        if (draftPrice.min > 0) next.set('minPrice', String(draftPrice.min)); else next.delete('minPrice')
        if (draftPrice.max < priceCeiling) next.set('maxPrice', String(draftPrice.max)); else next.delete('maxPrice')
        return next
      }, { replace: true })
    }, 500)
    return () => window.clearTimeout(timer)
  }, [draftPrice.max, draftPrice.min, priceCeiling, selectedMax, selectedMin, setParams])

  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  return (
    <div className="page-shell page-top">
      <div className="catalog-title"><div><h1>{search ? `Results for “${search}”` : 'Football gear'}</h1><p>{products.data?.length ?? 0} products</p></div><button className="button button-soft filter-toggle" type="button" onClick={() => setFiltersOpen(true)}><Faders size={19} /> Filters</button></div>
      <div className="catalog-layout">
        <aside className={filtersOpen ? 'filters is-open' : 'filters'}>
          <div className="filter-mobile-head"><strong>Filters</strong><button className="icon-button" type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)}><X size={22} /></button></div>
          <label htmlFor="shop-search">Search</label><input id="shop-search" type="search" value={search} onChange={(event) => update('search', event.target.value)} placeholder="Search products" />
          <label htmlFor="shop-category">Category</label><SelectField id="shop-category" value={category} onValueChange={(value) => update('category', value)} options={[{ value: '', label: 'All categories' }, ...(categories.data?.map((item) => ({ value: item._id, label: item.name })) ?? [])]} />
          <fieldset className="price-range"><legend>Price range</legend><div className="price-range-values"><span>From<strong>{formatPrice(draftPrice.min)}</strong></span><span>To<strong>{formatPrice(draftPrice.max)}</strong></span></div><div className="price-range-control" style={{ '--range-start': `${draftPrice.min / priceCeiling * 100}%`, '--range-end': `${draftPrice.max / priceCeiling * 100}%` } as React.CSSProperties}><div className="price-range-track" /><input aria-label="Minimum price" type="range" min="0" max={priceCeiling} step={PRICE_STEP} value={draftPrice.min} onChange={(event) => setDraftPrice((current) => ({ ...current, min: Math.min(Number(event.target.value), current.max - PRICE_STEP) }))} /><input aria-label="Maximum price" type="range" min="0" max={priceCeiling} step={PRICE_STEP} value={draftPrice.max} onChange={(event) => setDraftPrice((current) => ({ ...current, max: Math.max(Number(event.target.value), current.min + PRICE_STEP) }))} /></div></fieldset>
          <label htmlFor="shop-sort">Sort by</label><SelectField id="shop-sort" value={sort} onValueChange={(value) => update('sort', value)} options={[{ value: '', label: 'Newest' }, { value: 'price-asc', label: 'Price: low to high' }, { value: 'price-desc', label: 'Price: high to low' }, { value: 'rating', label: 'Top rated' }, { value: 'popular', label: 'Most viewed' }]} />
          {(search || category || sort || minPrice || maxPrice) && <button className="text-button" type="button" onClick={() => setParams({})}>Clear filters</button>}
        </aside>
        <section className={products.loading && products.data ? 'catalog-results is-updating' : 'catalog-results'} aria-busy={products.loading}>
          {products.loading && !products.data && <LoadingGrid />}
          {!products.loading && products.error && <ErrorState message={products.error} />}
          {!products.loading && !products.error && products.data?.length === 0 && <EmptyState title="No gear found" message="Try another search or clear the current filters." />}
          {products.data && products.data.length > 0 && <div className="product-grid">{products.data.map((product) => <ProductCard product={product} key={product._id} />)}</div>}
        </section>
      </div>
    </div>
  )
}
