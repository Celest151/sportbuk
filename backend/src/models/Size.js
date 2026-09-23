const mongoose = require('mongoose');

const SIZE_NAMES = ['XXS', 'XS', 'S', 'S Tall', 'M', 'M Tall', 'L', 'L Tall', 'XL', 'XL Tall', 'XXL', 'XXL Tall', '3XL', '3XL Tall', '4XL', '4XL Tall'];

const DEFAULT_SIZE_GUIDE = [
  {
    name: 'XXS',
    code: 'XXS',
    displayOrder: 1,
    chest: '72 - 80',
    height: '< 170',
    waist: '57 - 65',
    hip: '72 - 80'
  },
  {
    name: 'XS',
    code: 'XS',
    displayOrder: 2,
    chest: '80 - 88',
    height: '170 - 183',
    waist: '65 - 73',
    hip: '80 - 88'
  },
  {
    name: 'S',
    code: 'S',
    displayOrder: 3,
    chest: '88 - 96',
    height: '170 - 183',
    waist: '73 - 81',
    hip: '88 - 96'
  },
  {
    name: 'S Tall',
    code: 'S-TALL',
    displayOrder: 4,
    chest: '88 - 96',
    height: '183 - 196',
    waist: '73 - 81',
    hip: '88 - 96'
  },
  {
    name: 'M',
    code: 'M',
    displayOrder: 5,
    chest: '96 - 104',
    height: '170 - 183',
    waist: '81 - 89',
    hip: '96 - 104'
  },
  {
    name: 'M Tall',
    code: 'M-TALL',
    displayOrder: 6,
    chest: '96 - 104',
    height: '183 - 196',
    waist: '81 - 89',
    hip: '96 - 104'
  },
  {
    name: 'L',
    code: 'L',
    displayOrder: 7,
    chest: '104 - 112',
    height: '170 - 183',
    waist: '89 - 97',
    hip: '104 - 112'
  },
  {
    name: 'L Tall',
    code: 'L-TALL',
    displayOrder: 8,
    chest: '104 - 112',
    height: '183 - 196',
    waist: '89 - 97',
    hip: '104 - 112'
  },
  {
    name: 'XL',
    code: 'XL',
    displayOrder: 9,
    chest: '112 - 124',
    height: '170 - 183',
    waist: '97 - 109',
    hip: '112 - 120'
  },
  {
    name: 'XL Tall',
    code: 'XL-TALL',
    displayOrder: 10,
    chest: '112 - 124',
    height: '183 - 196',
    waist: '97 - 109',
    hip: '112 - 120'
  },
  {
    name: 'XXL',
    code: 'XXL',
    displayOrder: 11,
    chest: '124 - 136',
    height: '170 - 183',
    waist: '109 - 121',
    hip: '120 - 128'
  },
  {
    name: 'XXL Tall',
    code: 'XXL-TALL',
    displayOrder: 12,
    chest: '124 - 136',
    height: '183 - 196',
    waist: '109 - 121',
    hip: '120 - 128'
  },
  {
    name: '3XL',
    code: '3XL',
    displayOrder: 13,
    chest: '136 - 148',
    height: '170 - 183',
    waist: '121 - 133',
    hip: '128 - 136'
  },
  {
    name: '3XL Tall',
    code: '3XL-TALL',
    displayOrder: 14,
    chest: '136 - 148',
    height: '183 - 196',
    waist: '121 - 133',
    hip: '128 - 136'
  },
  {
    name: '4XL',
    code: '4XL',
    displayOrder: 15,
    chest: '148 - 160',
    height: '170 - 183',
    waist: '133 - 145',
    hip: '136 - 148'
  },
  {
    name: '4XL Tall',
    code: '4XL-TALL',
    displayOrder: 16,
    chest: '148 - 160',
    height: '183 - 196',
    waist: '133 - 145',
    hip: '136 - 148'
  }
];

const sizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Size name is required'],
      trim: true,
      unique: true,
      enum: SIZE_NAMES
    },
    code: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true
    },
    displayOrder: {
      type: Number,
      default: 0
    },
    usSize: {
      type: String,
      trim: true,
      default: ''
    },
    euSize: {
      type: String,
      trim: true,
      default: ''
    },
    height: {
      type: String,
      trim: true,
      default: ''
    },
    weight: {
      type: String,
      trim: true,
      default: ''
    },
    chest: {
      type: String,
      trim: true,
      default: ''
    },
    waist: {
      type: String,
      trim: true,
      default: ''
    },
    hip: {
      type: String,
      trim: true,
      default: ''
    },
    fitNote: {
      type: String,
      trim: true,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

sizeSchema.index({ displayOrder: 1, isActive: 1 });

const Size = mongoose.model('Size', sizeSchema);

Size.SIZE_NAMES = SIZE_NAMES;
Size.DEFAULT_SIZE_GUIDE = DEFAULT_SIZE_GUIDE;

module.exports = Size;
