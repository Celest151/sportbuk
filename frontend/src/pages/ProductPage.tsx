import { Check, Heart, Ruler } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductImage } from '../components/ui/ProductImage'
import { ErrorState } from '../components/ui/PageState'
import { useShop } from '../features/shop/ShopProvider'
import { useApi } from '../hooks/useApi'
import { formatPrice, productPrice } from '../lib/format'
import type { Product, ProductGalleryImage } from '../types'

function getGalleryImages(product: Product | null, color: string): ProductGalleryImage[] {
  if (!product) return []
  const images = product.images?.length
    ? product.images
    : product.image
      ? [{ url: product.image, color: null, alt: product.name, isPrimary: true }]
      : []
  const exact = images.filter((image) => image.color === color)
  const shared = images.filter((image) => !image.color)
  return exact.length ? [...exact, ...shared] : images
}

export function ProductPage() {
  const { slug } = useParams()
  const { data: product, loading, error } = useApi<Product>(slug ? `/products/${slug}` : null)
  const { addToBag, toggleWishlist, isWishlisted } = useShop()
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [selectedImageUrl, setSelectedImageUrl] = useState('')
  const [added, setAdded] = useState(false)
  const feedbackTimer = useRef<number | null>(null)

  useEffect(() => {
    if (!product) return
    setSize(product.defaultVariant?.size || product.sizes?.[0] || 'M')
    setColor(product.defaultVariant?.color || product.colorOptions?.[0]?.name || 'Default')
  }, [product])

  useEffect(() => {
    const images = getGalleryImages(product, color)
    setSelectedImageUrl(images.find((image) => image.isPrimary)?.url || images[0]?.url || '')
  }, [color, product])

  useEffect(() => () => {
    if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current)
  }, [])

  if (loading) return <div className="page-shell page-top"><div className="skeleton detail-skeleton" /></div>
  if (error || !product) return <div className="page-shell page-top"><ErrorState message={error || 'Product not found.'} /></div>
  const activeVariant = product.variants?.find((variant) => variant.size === size && variant.color === color)
  const hasVariants = Boolean(product.variants?.length)
  const available = hasVariants ? Boolean(activeVariant && activeVariant.stock > 0) : product.stock > 0
  const galleryImages = getGalleryImages(product, color)
  const selectedImage = galleryImages.find((image) => image.url === selectedImageUrl) || galleryImages[0]

  async function handleAddToBag() {
    if (!product || !await addToBag(product, size, color)) return
    setAdded(true)
    if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current)
    feedbackTimer.current = window.setTimeout(() => setAdded(false), 1200)
  }

  function chooseColor(nextColor: string) {
    setColor(nextColor)
    const availableVariants = product?.variants?.filter((variant) => variant.color === nextColor && variant.stock > 0) ?? []
    if (availableVariants.length && !availableVariants.some((variant) => variant.size === size)) {
      setSize(availableVariants[0].size)
    }
  }

  return (
    <div className="page-shell page-top product-detail">
      <div className="product-gallery">
        <div className="product-thumbnails" aria-label="Product images">
          {galleryImages.map((image, index) => <button className={selectedImage?.url === image.url ? 'active' : ''} type="button" aria-label={`View image ${index + 1} of ${galleryImages.length}`} aria-pressed={selectedImage?.url === image.url} onClick={() => setSelectedImageUrl(image.url)} key={`${image.url}-${index}`}><ProductImage src={image.url} alt="" seed={`${product.slug}-${index}`} /></button>)}
        </div>
        <div className="product-gallery-main"><ProductImage src={selectedImage?.url || product.image} alt={selectedImage?.alt || product.name} seed={product.slug} /></div>
      </div>
      <div className="product-info">
        <Link className="back-link" to="/products">Products / Football gear</Link>
        <h1>{product.name}</h1>
        <div className="detail-price">{formatPrice(activeVariant?.finalPrice ?? productPrice(product))}{product.discount > 0 && <span>{product.discount}% off</span>}</div>
        <p className={available ? 'stock in-stock' : 'stock out-stock'}><Check size={17} weight="bold" /> {available ? `${activeVariant?.stock ?? product.stock} in stock` : 'Out of stock'}</p>
        {product.colorOptions && product.colorOptions.length > 0 && <fieldset><legend>Color: {color}</legend><div className="swatches">{product.colorOptions.map((option) => <button className={color === option.name ? 'swatch active' : 'swatch'} style={{ '--swatch': option.code } as React.CSSProperties} type="button" aria-label={option.name} onClick={() => chooseColor(option.name)} key={option.name} />)}</div></fieldset>}
        {product.sizes && product.sizes.length > 0 && <fieldset><legend className="size-selector-head"><span>Choose a size</span>{product.sizeGuideType && product.sizeGuideType !== 'none' && <Link className="size-guide-link" to={`/size-guide#${product.sizeGuideType}`}><Ruler size={20} /> Size guide</Link>}</legend><div className="size-grid">{product.sizes.map((item) => { const variant = product.variants?.find((entry) => entry.color === color && entry.size === item); const disabled = hasVariants && (!variant || variant.stock <= 0); return <button className={size === item ? 'active' : ''} type="button" disabled={disabled} onClick={() => setSize(item)} key={item}>{item}</button> })}</div></fieldset>}
        <div className="detail-actions"><button className={added ? 'button button-dark detail-add is-added' : 'button button-dark detail-add'} type="button" disabled={!available} onClick={() => void handleAddToBag()}>{added && <Check size={19} weight="bold" />}{added ? 'Added to training bag' : 'Add to training bag'}</button><button className="button button-soft" type="button" onClick={() => void toggleWishlist(product, size, color)}><Heart size={20} weight={isWishlisted(product._id) ? 'fill' : 'regular'} /> {isWishlisted(product._id) ? 'Saved' : 'Save'}</button></div>
        <p className="product-description">{product.description}</p>
      </div>
    </div>
  )
}
