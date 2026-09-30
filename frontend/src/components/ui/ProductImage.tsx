import { useState } from 'react'
import { fallbackImage, resolveImageUrl } from '../../lib/api'

interface ProductImageProps {
  src?: string | null
  alt: string
  seed: string
  className?: string
}

export function ProductImage({ src, alt, seed, className }: ProductImageProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const imageUrl = resolveImageUrl(src, seed)
  const failed = failedUrl === imageUrl
  return (
    <img
      className={className}
      src={failed ? fallbackImage(seed) : imageUrl}
      alt={alt}
      loading="lazy"
      onError={() => { if (!failed) setFailedUrl(imageUrl) }}
    />
  )
}
