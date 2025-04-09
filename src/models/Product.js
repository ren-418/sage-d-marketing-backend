const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  features: [String],
  specifications: {
    type: Map,
    of: String
  },
  category: {
    type: String,
    enum: ['iPhone', 'iPad', 'Apple Watch', 'Accessories'],
    required: true
  },
  imageUrl: String,
  isOnSale: {
    type: Boolean,
    default: false
  },
  salePrice: Number,
  saleEndDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema); 