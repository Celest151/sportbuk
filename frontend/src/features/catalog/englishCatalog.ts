// Display translations for the photographed catalog. IDs, slugs, and variant
// values remain unchanged so gallery selection and bag requests use saved keys.
const translations: Record<string, string> = {
  'Áo đấu câu lạc bộ': 'Club Jerseys',
  'Giày và tất bóng đá': 'Football Boots & Socks',
  'Phụ kiện khác': 'Accessories',
  'Áo đấu FC Barcelona': 'FC Barcelona Jersey',
  'Áo đấu Manchester United': 'Manchester United Jersey',
  'Áo đấu Công An Hà Nội': 'Công An Hà Nội Jersey',
  'Giày bóng đá Nike Phantom': 'Nike Phantom Football Boots',
  'Giày bóng đá Nike Mercurial': 'Nike Mercurial Football Boots',
  'Tất bóng đá Nike màu đỏ': 'Nike Red Football Socks',
  'Tất bóng đá tuyển Pháp màu đỏ': 'France Red Football Socks',
  'Tất bóng đá tuyển Pháp': 'France Red Football Socks',
  'Tất bóng đá tuyển Anh màu trắng': 'England White Football Socks',
  'Tất bóng đá tuyển Anh': 'England White Football Socks',
  'Cúp Champions League trưng bày': 'Champions League Display Trophy',
  'Sắc màu câu lạc bộ': 'Club Colours',
  'Sẵn sàng ra sân': 'Pitch Essentials',
  'Áo đấu các câu lạc bộ với nhiều màu sắc và thiết kế khác nhau.': 'Club jerseys in a range of colours and designs.',
  'Giày đá bóng và tất dài dành cho tập luyện, thi đấu.': 'Football boots and knee-high socks for training and matchday.',
  'Vật phẩm trưng bày và phụ kiện liên quan đến bóng đá.': 'Football display pieces and accessories.',
  'Áo đấu FC Barcelona có hai phiên bản xanh đỏ và màu kem. Xem hình mặt trước, mặt sau và ảnh cầu thủ mặc áo.': 'FC Barcelona jersey in blue/red and cream. Explore front, back, and player photos.',
  'Áo đấu Manchester United với hai màu đỏ và trắng, kèm hình mặt trước, mặt sau và ảnh cầu thủ trên sân.': 'Manchester United jersey in red and white, with front, back, and on-pitch player photos.',
  'Áo đấu Công An Hà Nội có phiên bản đỏ và xanh, mỗi màu đi kèm ảnh chụp áo và cầu thủ tương ứng.': 'Công An Hà Nội jersey in red and blue, with matching product and player photos for each colour.',
  'Giày bóng đá Nike Phantom phối đỏ đen, có hình chụp cả đôi, mặt bên và từ trên xuống.': 'Nike Phantom football boots in red/black, with pair, side, and top views.',
  'Giày đá bóng sân cỏ nhân tạo Nike Mercurial phối vàng trắng, kèm ảnh mặt bên, mặt trên và phần đế.': 'Nike Mercurial artificial-turf football boots in gold/white, with side, top, and sole views.',
  'Tất bóng đá Nike màu đỏ, dáng dài đến đầu gối, phù hợp phối cùng trang phục thi đấu.': 'Red Nike knee-high football socks to complete your matchday kit.',
  'Tất bóng đá dài màu đỏ có dấu hiệu nhận diện đội tuyển Pháp trên thân tất.': 'Red knee-high football socks featuring France national team detailing.',
  'Tất bóng đá dài màu trắng của đội tuyển Anh, có ảnh mặt trước, mặt sau và góc nghiêng.': 'White England knee-high football socks, with front, back, and side photos.',
  'Hình ảnh cúp Champions League từ nhiều góc chụp, bao gồm ảnh cận cảnh và ảnh trên sân bóng.': 'Champions League trophy photographed from multiple angles, including close-ups and pitch views.',
  'Tuyển chọn áo đấu của các câu lạc bộ với những màu sắc nổi bật trên sân cỏ.': 'A selection of club jerseys in standout matchday colours.',
  'Giày và tất bóng đá dành cho những buổi tập luyện và thi đấu.': 'Football boots and socks for training sessions and matchday.',
  'Xanh đỏ': 'Blue / Red', 'Kem': 'Cream', 'Đỏ': 'Red', 'Trắng': 'White',
  'Xanh': 'Blue', 'Đỏ đen': 'Red / Black', 'Vàng trắng': 'Gold / White', 'Bạc': 'Silver',
  'mặt trước': 'front view', 'mặt sau': 'back view', 'trên sân': 'on the pitch',
  'cầu thủ mặc áo': 'player wearing the jersey', 'các cầu thủ mặc áo': 'players wearing the jersey',
  'cả đội': 'team photo', 'ảnh quảng bá': 'campaign photo', 'từ trên xuống': 'top view',
  'cả đôi': 'pair view', 'góc nghiêng': 'side view', 'phần đế': 'sole view',
  'cận cảnh': 'close-up', 'dưới ánh đèn': 'under stadium lights', 'cùng quả bóng': 'with a football',
  'góc khác': 'alternate view',
}

export function englishCatalogText(value: string) {
  if (translations[value]) return translations[value]
  // Seeded gallery alt text combines product, colour, and view labels.
  const parts = value.match(/^(.+) màu (.+) — (.+)$/)
  if (parts) return `${englishCatalogText(parts[1])} in ${englishCatalogText(parts[2])} — ${englishCatalogText(parts[3])}`
  return value
}

export function englishCatalogData<T>(data: T): T {
  if (Array.isArray(data)) return data.map((item) => englishCatalogData(item)) as T
  if (!data || typeof data !== 'object') return data
  return Object.fromEntries(Object.entries(data).map(([key, value]) => {
    if (key === 'variants' || key === 'colorOptions') return [key, value]
    if ((key === 'name' || key === 'description' || key === 'alt') && typeof value === 'string') return [key, englishCatalogText(value)]
    return [key, englishCatalogData(value)]
  })) as T
}
