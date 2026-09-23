const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Category = require('../src/models/Category');
const Collection = require('../src/models/Collection');
const Product = require('../src/models/Product');
const Size = require('../src/models/Size');

const categories = [
  {
    name: 'Áo bóng đá',
    slug: 'ao-bong-da',
    description: 'Áo thi đấu và áo tập bóng đá thoáng khí.',
    image: '/frontend/assets/images/football/product-match-jersey.svg',
    displayOrder: 1
  },
  {
    name: 'Quần và tất',
    slug: 'quan-va-tat',
    description: 'Quần thi đấu và tất dài hoàn thiện bộ trang phục sân cỏ.',
    image: '/frontend/assets/images/football/product-shorts.svg',
    displayOrder: 2
  },
  {
    name: 'Đồ thủ môn',
    slug: 'do-thu-mon',
    description: 'Áo và găng tay hỗ trợ thủ môn trong tập luyện và thi đấu.',
    image: '/frontend/assets/images/football/product-goalkeeper-jersey.svg',
    displayOrder: 3
  },
  {
    name: 'Phụ kiện bóng đá',
    slug: 'phu-kien-bong-da',
    description: 'Bóng, bảo vệ ống đồng và phụ kiện sân cỏ.',
    image: '/frontend/assets/images/football/product-match-ball.svg',
    displayOrder: 4
  }
];

const products = [
  {
    name: 'Striker Pro Match Jersey',
    slug: 'striker-pro-match-jersey',
    categorySlug: 'ao-bong-da',
    description: 'Áo thi đấu dáng thể thao với vải lưới thoáng khí, nhanh khô và đường may phẳng.',
    price: 549000,
    discount: 10,
    image: '/frontend/assets/images/football/product-match-jersey.svg',
    colors: [{ name: 'Đen', code: '#101214' }, { name: 'Đỏ', code: '#EF3340' }],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeGuideType: 'tops',
    stock: 12,
    isFeatured: true,
    ratingAverage: 4.8,
    views: 420
  },
  {
    name: 'Tempo Football Training Top',
    slug: 'tempo-football-training-top',
    categorySlug: 'ao-bong-da',
    description: 'Áo tập bóng đá tay ngắn, nhẹ và thoáng khí cho các buổi tập cường độ cao.',
    price: 429000,
    discount: 0,
    image: '/frontend/assets/images/football/product-training-top.svg',
    colors: [{ name: 'Trắng', code: '#F4F4F0' }, { name: 'Xanh', code: '#2563EB' }],
    sizes: ['S', 'M', 'L'],
    sizeGuideType: 'tops',
    stock: 10,
    isFeatured: false,
    ratingAverage: 4.5,
    views: 280
  },
  {
    name: 'Matchday Flex Football Shorts',
    slug: 'matchday-flex-football-shorts',
    categorySlug: 'quan-va-tat',
    description: 'Quần bóng đá co giãn, đai lưng chắc chắn và đường xẻ tà hỗ trợ chuyển hướng nhanh.',
    price: 399000,
    discount: 15,
    image: '/frontend/assets/images/football/product-shorts.svg',
    colors: [{ name: 'Đen', code: '#101214' }, { name: 'Xám', code: '#73777C' }],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeGuideType: 'bottoms',
    stock: 14,
    isFeatured: true,
    ratingAverage: 4.9,
    views: 510
  },
  {
    name: 'Elite Knee Football Socks',
    slug: 'elite-knee-football-socks',
    categorySlug: 'quan-va-tat',
    description: 'Tất bóng đá cao đến gối với đệm bàn chân và vùng cổ chân co giãn chống trượt.',
    price: 199000,
    discount: 5,
    image: '/frontend/assets/images/football/product-socks.svg',
    colors: [{ name: 'Đen', code: '#101214' }, { name: 'Tím', code: '#6D5BD0' }],
    sizes: ['S', 'M', 'L'],
    sizeGuideType: 'none',
    stock: 9,
    isFeatured: true,
    ratingAverage: 4.7,
    views: 390
  },
  {
    name: 'Guardian Padded Goalkeeper Jersey',
    slug: 'guardian-padded-goalkeeper-jersey',
    categorySlug: 'do-thu-mon',
    description: 'Áo thủ môn tay dài có đệm khuỷu tay và thân áo thoáng khí cho các pha bay người.',
    price: 799000,
    discount: 20,
    image: '/frontend/assets/images/football/product-goalkeeper-jersey.svg',
    colors: [{ name: 'Xanh', code: '#22C55E' }, { name: 'Đỏ', code: '#EF3340' }],
    sizes: ['M', 'L', 'XL'],
    sizeGuideType: 'tops',
    stock: 7,
    isFeatured: true,
    ratingAverage: 4.9,
    views: 620
  },
  {
    name: 'Control Grip Goalkeeper Gloves',
    slug: 'control-grip-goalkeeper-gloves',
    categorySlug: 'do-thu-mon',
    description: 'Găng tay thủ môn bằng latex bám dính, cổ tay điều chỉnh và mu bàn tay thoáng khí.',
    price: 649000,
    discount: 0,
    image: '/frontend/assets/images/football/product-goalkeeper-gloves.svg',
    colors: [{ name: 'Trắng', code: '#F4F4F0' }, { name: 'Đen', code: '#101214' }],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeGuideType: 'none',
    stock: 8,
    isFeatured: false,
    ratingAverage: 4.6,
    views: 235
  },
  {
    name: 'Impact Shield Shin Guards',
    slug: 'impact-shield-shin-guards',
    categorySlug: 'phu-kien-bong-da',
    description: 'Bảo vệ ống đồng nhẹ, vỏ cứng chịu lực và lớp lót EVA êm chân.',
    price: 299000,
    discount: 0,
    image: '/frontend/assets/images/football/product-shin-guards.svg',
    colors: [{ name: 'Đen', code: '#101214' }],
    sizes: ['S', 'M', 'L'],
    sizeGuideType: 'none',
    stock: 16,
    isFeatured: false,
    ratingAverage: 4.4,
    views: 190
  },
  {
    name: 'Flight Pro Match Football',
    slug: 'flight-pro-match-football',
    categorySlug: 'phu-kien-bong-da',
    description: 'Bóng thi đấu cỡ 5 với bề mặt PU liên kết nhiệt, cho quỹ đạo ổn định và cảm giác bóng chính xác.',
    price: 899000,
    discount: 10,
    image: '/frontend/assets/images/football/product-match-ball.svg',
    colors: [{ name: 'Trắng', code: '#F4F4F0' }],
    sizes: ['One Size'],
    sizeGuideType: 'none',
    stock: 11,
    isFeatured: true,
    ratingAverage: 4.8,
    views: 350
  }
];

const buildVariants = (product) => product.colors.flatMap((color, colorIndex) => (
  product.sizes.map((size, sizeIndex) => ({
    color: color.name,
    colorCode: color.code,
    size,
    price: product.price,
    stock: Math.max(2, product.stock - colorIndex - sizeIndex),
    sku: `DEMO-${product.slug.toUpperCase().replace(/[^A-Z0-9]+/g, '-').slice(0, 18)}-${color.name.toUpperCase()}-${size.replace(/\s+/g, '')}`
  }))
));

async function seed() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sportbuk_shop';
  await mongoose.connect(mongoUri);

  const previousDemoProductSlugs = [
    'velocity-dry-training-tee',
    'aero-mesh-performance-tank',
    'sprint-5-inch-running-shorts',
    'core-sculpt-high-rise-leggings',
    'stormbreak-lightweight-jacket',
    'recovery-zip-training-hoodie',
    'grip-pro-training-gloves',
    'transit-24l-gym-backpack'
  ];
  await Collection.deleteMany({ slug: { $in: ['training-core', 'run-after-dark'] } });
  await Product.deleteMany({ slug: { $in: previousDemoProductSlugs } });
  await Category.deleteMany({ slug: { $in: ['ao-the-thao', 'quan-the-thao', 'ao-khoac', 'phu-kien'] } });

  for (const category of categories) {
    await Category.updateOne(
      { slug: category.slug },
      { $set: { ...category, isActive: true } },
      { upsert: true, runValidators: true, setDefaultsOnInsert: false }
    );
  }

  await Size.deleteMany({});
  await Size.insertMany(Size.DEFAULT_SIZE_GUIDE.map((size) => ({
    ...size,
    isActive: true
  })));

  const categoryDocs = await Category.find({ slug: { $in: categories.map((category) => category.slug) } }).lean();
  const categoryBySlug = new Map(categoryDocs.map((category) => [category.slug, category]));

  for (const product of products) {
    const category = categoryBySlug.get(product.categorySlug);
    const variants = buildVariants(product);
    const images = product.colors.map((color, index) => ({
      url: product.image,
      color: color.name,
      alt: product.name,
      isPrimary: index === 0
    }));
    const quantity = variants.reduce((total, variant) => total + variant.stock, 0);

    await Product.updateOne(
      { slug: product.slug },
      {
        $set: {
          name: product.name,
          description: product.description,
          category: category._id,
          price: product.price,
          discount: product.discount,
          finalPrice: product.price * (1 - product.discount / 100),
          quantity,
          image: product.image,
          images,
          color: product.colors.map((color) => color.name),
          colorOptions: product.colors,
          variants,
          sizeGuideType: product.sizeGuideType,
          isActive: true,
          isFeatured: product.isFeatured,
          ratingAverage: product.ratingAverage,
          views: product.views
        },
        $setOnInsert: { slug: product.slug, commentCount: 0 }
      },
      { upsert: true, runValidators: true, setDefaultsOnInsert: false }
    );
  }

  const productDocs = await Product.find({ slug: { $in: products.map((product) => product.slug) } }).lean();
  const productBySlug = new Map(productDocs.map((product) => [product.slug, product]));
  const collections = [
    {
      name: 'Matchday XI',
      slug: 'matchday-xi',
      description: 'Bộ trang phục sân cỏ từ áo thi đấu đến phụ kiện bảo vệ.',
      image: products[0].image,
      productSlugs: ['striker-pro-match-jersey', 'matchday-flex-football-shorts', 'impact-shield-shin-guards'],
      displayOrder: 1
    },
    {
      name: 'Last Line',
      slug: 'last-line',
      description: 'Trang bị cho người gác đền và những pha cứu thua quyết định.',
      image: products[4].image,
      productSlugs: ['guardian-padded-goalkeeper-jersey', 'control-grip-goalkeeper-gloves', 'flight-pro-match-football'],
      displayOrder: 2
    }
  ];

  for (const collection of collections) {
    await Collection.updateOne(
      { slug: collection.slug },
      {
        $set: {
          name: collection.name,
          description: collection.description,
          image: collection.image,
          products: collection.productSlugs.map((slug) => productBySlug.get(slug)._id),
          isActive: true,
          isFeatured: true,
          displayOrder: collection.displayOrder
        },
        $setOnInsert: { slug: collection.slug }
      },
      { upsert: true, runValidators: true }
    );
  }

  console.log(`Seeded ${categories.length} categories, ${products.length} products, ${collections.length} collections, and ${Size.DEFAULT_SIZE_GUIDE.length} sizes.`);
}

seed()
  .catch((error) => {
    console.error('Demo seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
