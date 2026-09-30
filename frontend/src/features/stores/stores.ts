export interface Store {
  id: string
  name: string
  city: string
  district: string
  address: string
  phone: string
  hours: string
  flagship: boolean
}

// Location details preserved from frontend-legacy/pages/customer/store.html.
export const stores: Store[] = [
  { id: 'store-hcm-flagship', name: 'SPORTBUK Nguyễn Trãi Flagship', city: 'Ho Chi Minh City', district: 'District 1', address: '245 Nguyễn Trãi, Nguyễn Cư Trinh Ward, District 1, Ho Chi Minh City', phone: '028 7300 6868', hours: '09:00 - 22:00', flagship: true },
  { id: 'store-hcm-crescent', name: 'SPORTBUK Crescent Mall', city: 'Ho Chi Minh City', district: 'District 7', address: '101 Tôn Dật Tiên, Crescent Mall, District 7, Ho Chi Minh City', phone: '028 7300 6969', hours: '10:00 - 22:00', flagship: false },
  { id: 'store-hn-flagship', name: 'SPORTBUK Bà Triệu Flagship', city: 'Hanoi', district: 'Hai Bà Trưng', address: '191 Bà Triệu, Hai Bà Trưng District, Hanoi', phone: '024 7100 8282', hours: '09:30 - 21:30', flagship: true },
  { id: 'store-hn-vincom', name: 'SPORTBUK Vincom Royal City', city: 'Hanoi', district: 'Thanh Xuân', address: '72A Nguyễn Trãi, Vincom Royal City, Thanh Xuân District, Hanoi', phone: '024 7100 8383', hours: '10:00 - 22:00', flagship: false },
  { id: 'store-dn-branch', name: 'SPORTBUK Lê Duẩn', city: 'Da Nang', district: 'Hải Châu', address: '215 Lê Duẩn, Hải Châu District, Da Nang', phone: '0236 7300 9191', hours: '09:00 - 21:30', flagship: false },
]

export function getStoreMapUrl(store: Store, embed = false) {
  const query = encodeURIComponent(store.address)
  return embed
    ? `https://maps.google.com/maps?hl=en&q=${query}&z=16&ie=UTF8&iwloc=B&output=embed`
    : `https://www.google.com/maps/search/?api=1&query=${query}`
}
