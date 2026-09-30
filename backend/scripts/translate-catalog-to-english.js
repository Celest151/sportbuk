const mongoose = require('mongoose');
const { categories, products, colorLabels } = require('./seed-demo');
const Category = require('../src/models/Category');
const Collection = require('../src/models/Collection');
const Product = require('../src/models/Product');
const Wishlist = require('../src/models/Wishlist');

// Translate known Vietnamese text regardless of slug changes made in admin.
const oldCategories = [
  ['club-jerseys', 'Áo đấu câu lạc bộ', 'Áo đấu các câu lạc bộ với nhiều màu sắc và thiết kế khác nhau.'],
  ['boots-and-socks', 'Giày và tất bóng đá', 'Giày đá bóng và tất dài dành cho tập luyện, thi đấu.'],
  ['misc', 'Phụ kiện khác', 'Vật phẩm trưng bày và phụ kiện liên quan đến bóng đá.']
];
const oldProducts = [
  ['barcelona-club-jersey', 'Áo đấu FC Barcelona', 'Áo đấu FC Barcelona có hai phiên bản xanh đỏ và màu kem. Xem hình mặt trước, mặt sau và ảnh cầu thủ mặc áo.'],
  ['manchester-united-jersey', 'Áo đấu Manchester United', 'Áo đấu Manchester United với hai màu đỏ và trắng, kèm hình mặt trước, mặt sau và ảnh cầu thủ trên sân.'],
  ['cong-an-ha-noi-jersey', 'Áo đấu Công An Hà Nội', 'Áo đấu Công An Hà Nội có phiên bản đỏ và xanh, mỗi màu đi kèm ảnh chụp áo và cầu thủ tương ứng.'],
  ['nike-phantom-boots', 'Giày bóng đá Nike Phantom', 'Giày bóng đá Nike Phantom phối đỏ đen, có hình chụp cả đôi, mặt bên và từ trên xuống.'],
  ['nike-mercurial-boots', 'Giày bóng đá Nike Mercurial', 'Giày đá bóng sân cỏ nhân tạo Nike Mercurial phối vàng trắng, kèm ảnh mặt bên, mặt trên và phần đế.'],
  ['nike-red-socks', 'Tất bóng đá Nike màu đỏ', 'Tất bóng đá Nike màu đỏ, dáng dài đến đầu gối, phù hợp phối cùng trang phục thi đấu.'],
  ['france-red-socks', 'Tất bóng đá tuyển Pháp màu đỏ', 'Tất bóng đá dài màu đỏ có dấu hiệu nhận diện đội tuyển Pháp trên thân tất.'],
  ['england-white-socks', 'Tất bóng đá tuyển Anh màu trắng', 'Tất bóng đá dài màu trắng của đội tuyển Anh, có ảnh mặt trước, mặt sau và góc nghiêng.'],
  ['champions-league-trophy', 'Cúp Champions League trưng bày', 'Hình ảnh cúp Champions League từ nhiều góc chụp, bao gồm ảnh cận cảnh và ảnh trên sân bóng.'],
  ['france-red-socks', 'Tất bóng đá tuyển Pháp', 'Tất bóng đá dài màu đỏ có dấu hiệu nhận diện đội tuyển Pháp trên thân tất.'],
  ['england-white-socks', 'Tất bóng đá tuyển Anh', 'Tất bóng đá dài màu trắng của đội tuyển Anh, có ảnh mặt trước, mặt sau và góc nghiêng.']
];
const oldCollections = [
  ['club-matchday', 'Sắc màu câu lạc bộ', 'Tuyển chọn áo đấu của các câu lạc bộ với những màu sắc nổi bật trên sân cỏ.', 'Club Colours', 'A selection of club jerseys in standout matchday colours.'],
  ['pitch-essentials', 'Sẵn sàng ra sân', 'Giày và tất bóng đá dành cho những buổi tập luyện và thi đấu.', 'Pitch Essentials', 'Football boots and socks for training sessions and matchday.']
];
const views = {
  'mặt trước': 'front view', 'mặt sau': 'back view', 'trên sân': 'on the pitch',
  'cầu thủ mặc áo': 'player wearing the jersey', 'các cầu thủ mặc áo': 'players wearing the jersey',
  'cả đội': 'team photo', 'ảnh quảng bá': 'campaign photo', 'từ trên xuống': 'top view',
  'cả đôi': 'pair view', 'góc nghiêng': 'side view', 'phần đế': 'sole view',
  'cận cảnh': 'close-up', 'dưới ánh đèn': 'under stadium lights',
  'cùng quả bóng': 'with a football', 'góc khác': 'alternate view'
};
const productNames = new Map(oldProducts.map(([slug, name]) => [name, products.find((item) => item.slug === slug).name]));

async function translateFields(Model, entries, seedRecords) {
  let changed = 0;
  for (const [slug, oldName, oldDescription, collectionName, collectionDescription] of entries) {
    const current = seedRecords?.find((item) => item.slug === slug);
    const name = current?.name || collectionName;
    const description = current?.description || collectionDescription;
    // Update each field independently, and compare the original value in the
    // query so reruns and concurrent custom edits remain safe.
    for (const [field, oldValue, value] of [['name', oldName, name], ['description', oldDescription, description]]) {
      const result = await Model.updateMany({ [field]: oldValue }, { $set: { [field]: value } }, { runValidators: true });
      changed += result.modifiedCount;
    }
  }
  return changed;
}

async function translateCatalog() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sportbuk_shop', { serverSelectionTimeoutMS: 10000 });
  const categoryFields = await translateFields(Category, oldCategories, categories);
  const productFields = await translateFields(Product, oldProducts, products);
  const collectionFields = await translateFields(Collection, oldCollections);

  let galleryLabels = 0;
  const records = await Product.find({}).select('images').lean();
  for (const record of records) {
    for (const [index, image] of (record.images || []).entries()) {
      const parts = image.alt?.match(/^(.+) màu (.+) — (.+)$/);
      if (!parts || !productNames.has(parts[1]) || !colorLabels[parts[2]] || !views[parts[3]]) continue;
      const field = `images.${index}.alt`;
      const result = await Product.updateOne({ _id: record._id, [field]: image.alt, [`images.${index}.url`]: image.url }, {
        $set: { [field]: `${productNames.get(parts[1])} in ${colorLabels[parts[2]]} — ${views[parts[3]]}` }
      }, { runValidators: true });
      galleryLabels += result.modifiedCount;
    }
  }

  let wishlistRecords = 0;
  for (const [oldName, name] of productNames) {
    const result = await Wishlist.updateMany({ 'items.nameSnapshot': oldName }, {
      $set: { 'items.$[item].nameSnapshot': name }
    }, { arrayFilters: [{ 'item.nameSnapshot': oldName }], runValidators: true });
    wishlistRecords += result.modifiedCount;
  }

  console.log(`Translated fields: ${productFields} product, ${categoryFields} category, ${collectionFields} collection.`);
  console.log(`Translated ${galleryLabels} gallery labels and updated ${wishlistRecords} wishlist records.`);
  const names = await Product.find({}).select('name slug -_id').sort('slug').lean();
  names.forEach((item) => console.log(`${item.slug}: ${item.name}`));
}

translateCatalog()
  .catch((error) => { console.error('Catalog translation failed:', error.message); process.exitCode = 1; })
  .finally(async () => { await mongoose.disconnect(); });
