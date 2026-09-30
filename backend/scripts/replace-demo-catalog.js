const path = require('path');
const { execFileSync } = require('child_process');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Cart = require('../src/models/Cart');
const Category = require('../src/models/Category');
const Collection = require('../src/models/Collection');
const Order = require('../src/models/Order');
const Product = require('../src/models/Product');
const Wishlist = require('../src/models/Wishlist');

const oldProductSlugs = [
  'striker-pro-match-jersey', 'tempo-football-training-top',
  'matchday-flex-football-shorts', 'elite-knee-football-socks',
  'guardian-padded-goalkeeper-jersey', 'control-grip-goalkeeper-gloves',
  'impact-shield-shin-guards', 'flight-pro-match-football'
];
const newProductSlugs = [
  'barcelona-club-jersey', 'manchester-united-jersey', 'cong-an-ha-noi-jersey',
  'nike-phantom-boots', 'nike-mercurial-boots', 'nike-red-socks',
  'france-red-socks', 'england-white-socks', 'champions-league-trophy'
];
const oldCategorySlugs = ['ao-bong-da', 'quan-va-tat', 'do-thu-mon', 'phu-kien-bong-da'];
const oldCollectionSlugs = ['matchday-xi', 'last-line'];

async function replaceDemoCatalog() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sportbuk_shop';
  await mongoose.connect(mongoUri);

  const oldProducts = await Product.find({ slug: { $in: oldProductSlugs } }).select('_id').lean();
  const oldIds = oldProducts.map((product) => product._id);

  if (oldIds.length && await Order.exists({ 'items.product': { $in: oldIds } })) {
    throw new Error('Old demo products are referenced by orders. Keep those records or migrate the orders before replacement.');
  }

  // Create new records first; leave existing new-catalog edits intact on reruns.
  execFileSync(process.execPath, [path.join(__dirname, 'seed-demo.js')], { env: process.env, stdio: 'inherit' });
  if (await Product.countDocuments({ slug: { $in: newProductSlugs } }) !== newProductSlugs.length) {
    throw new Error('New catalog is incomplete. Old products were not removed.');
  }

  if (oldIds.length) {
    const carts = await Cart.find({ 'items.product': { $in: oldIds } });
    const removed = new Set(oldIds.map(String));
    for (const cart of carts) {
      cart.items = cart.items.filter((item) => !removed.has(String(item.product)));
      await cart.save();
    }

    await Wishlist.updateMany({}, { $pull: { items: { product: { $in: oldIds } } } });
    await Collection.updateMany({}, { $pull: { products: { $in: oldIds } } });
    await Product.deleteMany({ _id: { $in: oldIds } });
  }

  await Collection.deleteMany({ slug: { $in: oldCollectionSlugs } });
  const oldCategories = await Category.find({ slug: { $in: oldCategorySlugs } }).select('_id').lean();
  for (const category of oldCategories) {
    if (!await Product.exists({ category: category._id })) {
      await Category.deleteOne({ _id: category._id });
    }
  }

  console.log(`Replaced ${oldIds.length} demo products with photographed catalog products.`);
}

replaceDemoCatalog()
  .catch((error) => {
    console.error('Catalog replacement failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
