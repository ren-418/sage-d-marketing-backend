const Product = require('../models/Product');
const ServiceCenter = require('../models/ServiceCenter');

const dataService = {
  async getProductsByCategory(category) {
    return await Product.find({ category });
  },

  async getProductByModel(model) {
    return await Product.findOne({ model: new RegExp(model, 'i') });
  },

  async getProductsOnSale() {
    return await Product.find({ isOnSale: true });
  },

  async getServiceCentersNearLocation(latitude, longitude, maxDistance = 5000) {
    return await ServiceCenter.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistance
        }
      }
    });
  },

  async getProductStock(model) {
    const product = await Product.findOne({ model: new RegExp(model, 'i') });
    return product ? product.stock : 0;
  },

  async getProductSpecifications(model) {
    const product = await Product.findOne({ model: new RegExp(model, 'i') });
    return product ? product.specifications : null;
  },

  async getCurrentDeals() {
    return await Product.find({
      isOnSale: true,
      saleEndDate: { $gt: new Date() }
    }).sort({ salePrice: 1 });
  }
};

module.exports = dataService; 