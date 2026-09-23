import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { apiRequest } from '../../lib/api'
import { productPrice } from '../../lib/format'
import type { BagItem, Product, WishlistItem } from '../../types'
import { useAuth } from '../auth/AuthProvider'

interface CartResponse {
  data: { items: BagItem[] }
}

interface WishlistResponse {
  data: WishlistItem[]
}

interface ShopContextValue {
  bag: BagItem[]
  wishlist: WishlistItem[]
  notice: string
  addToBag: (product: Product, size?: string, color?: string) => Promise<boolean>
  updateBagQuantity: (item: BagItem, quantity: number) => Promise<boolean>
  removeFromBag: (item: BagItem) => Promise<void>
  toggleWishlist: (product: Product, size?: string, color?: string) => Promise<void>
  isWishlisted: (productId: string) => boolean
  clearNotice: () => void
}

const BAG_KEY = 'sportbuk_guest_bag'
const WISHLIST_KEY = 'sportbuk_guest_wishlist'
const ShopContext = createContext<ShopContextValue | null>(null)

function readLocal<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]') as T[]
  } catch {
    return []
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  const [bag, setBag] = useState<BagItem[]>(() => readLocal(BAG_KEY))
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => readLocal(WISHLIST_KEY))
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!token) return
    Promise.all([
      apiRequest<WishlistResponse>('/wishlist', {}, token),
      apiRequest<CartResponse>('/carts', {}, token),
    ]).then(([wish, cart]) => {
      setWishlist(wish.data)
      setBag(cart.data.items.filter((item) => item.product))
    }).catch(() => setNotice('Could not refresh your saved gear.'))
  }, [token])

  useEffect(() => {
    if (!token) localStorage.setItem(BAG_KEY, JSON.stringify(bag))
  }, [bag, token])

  useEffect(() => {
    if (!token) localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
  }, [wishlist, token])

  async function addToBag(product: Product, size = product.defaultVariant?.size || product.sizes?.[0] || 'M', color = product.defaultVariant?.color || product.colorOptions?.[0]?.name || 'Default') {
    try {
      if (token) {
        const response = await apiRequest<CartResponse>('/carts/add', {
          method: 'POST',
          body: JSON.stringify({ productId: product._id, quantity: 1, size, color }),
        }, token)
        setBag(response.data.items.filter((item) => item.product))
      } else {
        setBag((current) => {
          const found = current.find((item) => item.product._id === product._id && item.selectedSize === size && item.selectedColor === color)
          if (found) return current.map((item) => item === found ? { ...item, quantity: item.quantity + 1 } : item)
          return [...current, { product, quantity: 1, selectedSize: size, selectedColor: color, price: productPrice(product), discount: product.discount }]
        })
      }
      setNotice(`${product.name} added to your training bag.`)
      return true
    } catch (reason) {
      setNotice(reason instanceof Error ? reason.message : 'Could not add this product to your training bag.')
      return false
    }
  }

  async function removeFromBag(item: BagItem) {
    try {
      if (token) {
        const path = `/carts/remove/${item.product._id}/${encodeURIComponent(item.selectedSize)}/${encodeURIComponent(item.selectedColor)}`
        const response = await apiRequest<CartResponse>(path, { method: 'DELETE' }, token)
        setBag(response.data.items.filter((entry) => entry.product))
      } else {
        setBag((current) => current.filter((entry) => entry !== item))
      }
    } catch (reason) {
      setNotice(reason instanceof Error ? reason.message : 'Could not remove this bag item.')
    }
  }

  async function updateBagQuantity(item: BagItem, quantity: number) {
    const nextQuantity = Math.max(1, Math.trunc(quantity))
    try {
      if (token) {
        const response = await apiRequest<CartResponse>('/carts/update', {
          method: 'PUT',
          body: JSON.stringify({
            productId: item.product._id,
            quantity: nextQuantity,
            size: item.selectedSize,
            color: item.selectedColor,
          }),
        }, token)
        setBag(response.data.items.filter((entry) => entry.product))
      } else {
        setBag((current) => current.map((entry) => entry === item ? { ...entry, quantity: nextQuantity } : entry))
      }
      return true
    } catch (reason) {
      setNotice(reason instanceof Error ? reason.message : 'Could not update this bag item.')
      return false
    }
  }

  async function toggleWishlist(product: Product, size = product.defaultVariant?.size || product.sizes?.[0] || 'M', color = product.defaultVariant?.color || product.colorOptions?.[0]?.name || 'Default') {
    const exists = wishlist.some((item) => item.productId === product._id)
    if (token) {
      const response = await apiRequest<WishlistResponse>(exists ? `/wishlist/items/${product._id}` : '/wishlist/items', {
        method: exists ? 'DELETE' : 'POST',
        body: exists ? undefined : JSON.stringify({ productId: product._id, size, color }),
      }, token)
      setWishlist(response.data)
    } else if (exists) {
      setWishlist((current) => current.filter((item) => item.productId !== product._id))
    } else {
      setWishlist((current) => [{
        productId: product._id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        price: productPrice(product),
        originalPrice: product.price,
        size,
        color,
        addedAt: new Date().toISOString(),
      }, ...current])
    }
    setNotice(exists ? 'Removed from wishlist.' : `${product.name} saved to wishlist.`)
  }

  return (
    <ShopContext.Provider value={{ bag, wishlist, notice, addToBag, updateBagQuantity, removeFromBag, toggleWishlist, isWishlisted: (id) => wishlist.some((item) => item.productId === id), clearNotice: () => setNotice('') }}>
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const context = useContext(ShopContext)
  if (!context) throw new Error('useShop must be used within ShopProvider')
  return context
}
