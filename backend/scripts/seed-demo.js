const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Category = require('../src/models/Category');
const Collection = require('../src/models/Collection');
const Product = require('../src/models/Product');
const Size = require('../src/models/Size');

const catalogImage = (slug, file) => `/assets/images/catalog/${slug}/${file}`;

const categories = [
  { name: 'Club Jerseys', slug: 'club-jerseys', description: 'Club jerseys in a range of colours and designs.', image: catalogImage('barcelona-club-jersey', 'blue-red-front.png'), displayOrder: 1 },
  { name: 'Football Boots & Socks', slug: 'boots-and-socks', description: 'Football boots and knee-high socks for training and matchday.', image: catalogImage('nike-mercurial-boots', 'gold-white-pair.webp'), displayOrder: 2 },
  { name: 'Accessories', slug: 'misc', description: 'Football display pieces and accessories.', image: catalogImage('champions-league-trophy', 'silver-trophy-and-ball.jpg'), displayOrder: 3 }
];

// Prices and stock are demo values. Keep every gallery photo associated with its actual colorway.
const products = [
  {
    name: 'FC Barcelona Jersey', slug: 'barcelona-club-jersey', categorySlug: 'club-jerseys',
    description: 'FC Barcelona jersey in blue/red and cream. Explore front, back, and player photos.',
    price: 749000, discount: 0, sizes: ['S', 'M', 'L', 'XL'], sizeGuideType: 'tops', stock: 9, isFeatured: true,
    colors: [{ name: 'Xanh đỏ', code: '#89325A', files: ['blue-red-front.png', 'blue-red-back.png', 'blue-red-action.png', 'blue-red-promo.png', 'blue-red-players.png'] },
      { name: 'Kem', code: '#E7D8B3', files: ['cream-front.png', 'cream-back.png', 'cream-action.png', 'cream-promo.png', 'cream-players.png'] }]
  },
  {
    name: 'Manchester United Jersey', slug: 'manchester-united-jersey', categorySlug: 'club-jerseys',
    description: 'Manchester United jersey in red and white, with front, back, and on-pitch player photos.',
    price: 749000, discount: 0, sizes: ['S', 'M', 'L', 'XL'], sizeGuideType: 'tops', stock: 9, isFeatured: true,
    colors: [{ name: 'Đỏ', code: '#C51C25', files: ['red-front.png', 'red-back.png', 'red-player.png', 'red-players.png', 'red-team.png'] },
      { name: 'Trắng', code: '#EEE9F7', files: ['white-front.png', 'white-back.png', 'white-player.png', 'white-players.png', 'white-team.png'] }]
  },
  {
    name: 'Công An Hà Nội Jersey', slug: 'cong-an-ha-noi-jersey', categorySlug: 'club-jerseys',
    description: 'Công An Hà Nội jersey in red and blue, with matching product and player photos for each colour.',
    price: 649000, discount: 0, sizes: ['S', 'M', 'L', 'XL'], sizeGuideType: 'tops', stock: 8, isFeatured: true,
    colors: [{ name: 'Đỏ', code: '#C8192E', files: ['red-front.png', 'red-back.png', 'red-action.png', 'red-player.png', 'red-team.png'] },
      { name: 'Xanh', code: '#1653A8', files: ['blue-front.png', 'blue-back.png', 'blue-player.png', 'blue-action.png'] }]
  },
  {
    name: 'Nike Phantom Football Boots', slug: 'nike-phantom-boots', categorySlug: 'boots-and-socks',
    description: 'Nike Phantom football boots in red/black, with pair, side, and top views.',
    price: 1499000, discount: 0, sizes: ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45', 'EU 46'], sizeGuideType: 'none', stock: 5, isFeatured: true,
    colors: [{ name: 'Đỏ đen', code: '#E84140', files: ['red-black-pair.webp', 'red-black-side.webp', 'red-black-top.webp', 'red-black-detail.jpg'] }]
  },
  {
    name: 'Nike Mercurial Football Boots', slug: 'nike-mercurial-boots', categorySlug: 'boots-and-socks',
    description: 'Nike Mercurial artificial-turf football boots in gold/white, with side, top, and sole views.',
    price: 1399000, discount: 0, sizes: ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45', 'EU 46'], sizeGuideType: 'none', stock: 5, isFeatured: true,
    colors: [{ name: 'Vàng trắng', code: '#B89B51', files: ['gold-white-pair.webp', 'gold-white-side.jpg', 'gold-white-top.png', 'gold-white-side-sole.jpg'] }]
  },
  {
    name: 'Nike Red Football Socks', slug: 'nike-red-socks', categorySlug: 'boots-and-socks',
    description: 'Red Nike knee-high football socks to complete your matchday kit.',
    price: 199000, discount: 0, sizes: ['S', 'M', 'L'], sizeGuideType: 'none', stock: 12, isFeatured: false,
    colors: [{ name: 'Đỏ', code: '#D91C29', files: ['red-front.webp', 'red-side.jpg'] }]
  },
  {
    name: 'France Red Football Socks', slug: 'france-red-socks', categorySlug: 'boots-and-socks',
    description: 'Red knee-high football socks featuring France national team detailing.',
    price: 199000, discount: 0, sizes: ['S', 'M', 'L'], sizeGuideType: 'none', stock: 10, isFeatured: false,
    colors: [{ name: 'Đỏ', code: '#C91527', files: ['red-front.jpg'] }]
  },
  {
    name: 'England White Football Socks', slug: 'england-white-socks', categorySlug: 'boots-and-socks',
    description: 'White England knee-high football socks, with front, back, and side photos.',
    price: 199000, discount: 0, sizes: ['S', 'M', 'L'], sizeGuideType: 'none', stock: 10, isFeatured: false,
    colors: [{ name: 'Trắng', code: '#F1F1F1', files: ['white-front.webp', 'white-back.webp', 'white-side.webp'] }]
  },
  {
    name: 'Champions League Display Trophy', slug: 'champions-league-trophy', categorySlug: 'misc',
    description: 'Champions League trophy photographed from multiple angles, including close-ups and pitch views.',
    price: 899000, discount: 0, sizes: ['One Size'], sizeGuideType: 'none', stock: 3, isFeatured: true,
    colors: [{ name: 'Bạc', code: '#B9BDC2', files: ['silver-trophy-and-ball.jpg', 'silver-trophy-closeup.jpg', 'silver-trophy-lights.jpg', 'silver-trophy-pitch.jpg'] }]
  }
];

const buildVariants = (product) => product.colors.flatMap((color, colorIndex) => (
  product.sizes.map((size, sizeIndex) => ({
    color: color.name,
    colorCode: color.code,
    size,
    price: product.price,
    stock: Math.max(1, product.stock - colorIndex - sizeIndex),
    sku: `DEMO-${product.slug.toUpperCase().replace(/[^A-Z0-9]+/g, '-').slice(0, 18)}-${color.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]+/g, '')}-${size.replace(/\s+/g, '')}`
  }))
));

const galleryViewNames = { front: 'front view', back: 'back view', action: 'on the pitch', player: 'player wearing the jersey', players: 'players wearing the jersey', team: 'team photo', promo: 'campaign photo', top: 'top view', pair: 'pair view', side: 'side view', sole: 'sole view', detail: 'close-up', closeup: 'close-up', lights: 'under stadium lights', pitch: 'on the pitch', ball: 'with a football' };
const colorLabels = { 'Xanh đỏ': 'Blue / Red', 'Kem': 'Cream', 'Đỏ': 'Red', 'Trắng': 'White', 'Xanh': 'Blue', 'Đỏ đen': 'Red / Black', 'Vàng trắng': 'Gold / White', 'Bạc': 'Silver' };

async function seed() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sportbuk_shop';
  await mongoose.connect(mongoUri);

  for (const category of categories) {
    await Category.updateOne(
      { slug: category.slug },
      { $setOnInsert: { ...category, isActive: true } },
      { upsert: true, runValidators: true }
    );
  }

  await Size.bulkWrite(Size.DEFAULT_SIZE_GUIDE.map((size) => ({
    updateOne: {
      filter: { name: size.name },
      update: { $setOnInsert: { ...size, isActive: true } },
      upsert: true
    }
  })));

  const categoryDocs = await Category.find({ slug: { $in: categories.map((category) => category.slug) } }).lean();
  const categoryBySlug = new Map(categoryDocs.map((category) => [category.slug, category]));

  for (const product of products) {
    const category = categoryBySlug.get(product.categorySlug);
    const variants = buildVariants(product);
    const images = product.colors.flatMap((color) => color.files.map((file) => ({
      url: catalogImage(product.slug, file),
      color: color.name,
      alt: `${product.name} in ${colorLabels[color.name] || color.name} — ${galleryViewNames[path.parse(file).name.split('-').pop()] || 'alternate view'}`,
      isPrimary: false
    })));
    images[0].isPrimary = true;
    const quantity = variants.reduce((total, variant) => total + variant.stock, 0);

    await Product.updateOne(
      { slug: product.slug },
      {
        $setOnInsert: {
          name: product.name,
          description: product.description,
          category: category._id,
          price: product.price,
          discount: product.discount,
          finalPrice: product.price * (1 - product.discount / 100),
          quantity,
          image: images[0].url,
          images,
          color: product.colors.map((color) => color.name),
          colorOptions: product.colors.map(({ name, code }) => ({ name, code })),
          variants,
          sizeGuideType: product.sizeGuideType,
          isActive: true,
          isFeatured: product.isFeatured,
          ratingAverage: 0,
          views: 0,
          slug: product.slug,
          commentCount: 0
        }
      },
      { upsert: true, runValidators: true, setDefaultsOnInsert: false }
    );
  }

  const productDocs = await Product.find({ slug: { $in: products.map((product) => product.slug) } }).lean();
  const productBySlug = new Map(productDocs.map((product) => [product.slug, product]));
  const collections = [
    {
      name: 'Club Colours',
      slug: 'club-matchday',
      description: 'A selection of club jerseys in standout matchday colours.',
      image: catalogImage('barcelona-club-jersey', 'blue-red-players.png'),
      productSlugs: ['barcelona-club-jersey', 'manchester-united-jersey', 'cong-an-ha-noi-jersey'],
      displayOrder: 1
    },
    {
      name: 'Pitch Essentials',
      slug: 'pitch-essentials',
      description: 'Football boots and socks for training sessions and matchday.',
      image: catalogImage('nike-phantom-boots', 'red-black-pair.webp'),
      productSlugs: ['nike-phantom-boots', 'nike-mercurial-boots', 'nike-red-socks', 'england-white-socks'],
      displayOrder: 2
    }
  ];

  for (const collection of collections) {
    await Collection.updateOne(
      { slug: collection.slug },
      {
        $setOnInsert: {
          name: collection.name,
          description: collection.description,
          image: collection.image,
          products: collection.productSlugs.map((slug) => productBySlug.get(slug)._id),
          isActive: true,
          isFeatured: true,
          displayOrder: collection.displayOrder,
          slug: collection.slug
        }
      },
      { upsert: true, runValidators: true }
    );
  }

  console.log(`Ensured ${categories.length} categories, ${products.length} products, ${collections.length} collections, and ${Size.DEFAULT_SIZE_GUIDE.length} sizes. Existing records were left unchanged.`);
}

module.exports = { categories, products, colorLabels, galleryViewNames };

if (require.main === module) {
  seed()
    .catch((error) => {
      console.error('Demo seed failed:', error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await mongoose.disconnect();
    });
}
