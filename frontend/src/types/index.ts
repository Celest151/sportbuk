export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image: string | null
}

export interface ProductVariant {
  color: string
  colorCode: string
  size: string
  price: number
  finalPrice: number
  stock: number
  sku: string | null
}

export interface ProductGalleryImage {
  url: string
  color: string | null
  alt: string
  isPrimary: boolean
}

export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  category?: Category | string | null
  categoryId?: string | null
  price: number
  discount: number
  finalPrice: number
  currentPrice?: number
  minCurrentPrice?: number
  maxCurrentPrice?: number
  stock: number
  image: string | null
  images?: ProductGalleryImage[]
  colors?: string[]
  colorOptions?: Array<{ name: string; code: string }>
  sizes?: string[]
  variants?: ProductVariant[]
  sizeGuideType?: 'tops' | 'bottoms' | 'none'
  defaultVariant?: ProductVariant | null
  isFeatured?: boolean
  isActive?: boolean
  ratingAverage?: number
}

export interface Collection {
  _id: string
  name: string
  slug: string
  description: string
  image: string | null
  productCount: number
  products?: Product[]
}

export interface User {
  _id: string
  fullName: string
  email: string
  phone?: string
  avatar: string | null
  role: 'user' | 'admin'
}

export interface BagItem {
  product: Product
  quantity: number
  selectedSize: string
  selectedColor: string
  price: number
  discount: number
}

export interface WishlistItem {
  productId: string
  slug: string
  name: string
  image: string | null
  price: number
  originalPrice: number
  size: string
  color: string
  addedAt: string
}
