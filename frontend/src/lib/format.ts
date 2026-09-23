export const formatPrice = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)

export function productPrice(product: { minCurrentPrice?: number; currentPrice?: number; finalPrice?: number; price: number }) {
  return product.minCurrentPrice ?? product.currentPrice ?? product.finalPrice ?? product.price
}
