import { useEffect, useState } from 'react'
import { fallbackImage, resolveImageUrl } from '../../lib/api'

interface ProductImageProps {
  src?: string | null
  alt: string
  seed: string
  className?: string
}

export function ProductImage({ src, alt, seed, className }: ProductImageProps) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])
  return (
    <img
      className={className}
      src={failed ? fallbackImage(seed) : resolveImageUrl(src, seed)}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
