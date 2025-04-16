
const Service = require('../models/Service');
const logger = require('../utils/logger');

const dataService = {
  async getAvailableServices() {
    try {
      const services = await Service.find({ isAvailable: true });
      return services;
    } catch (error) {
      logger.error('Error fetching available services:', error);
      throw error;
    }
  },

  async getServiceByCategory(category) {
    try {
      const services = await Service.find({ 
        category,
        isAvailable: true 
      });
      return services;
    } catch (error) {
      logger.error(`Error fetching services for category ${category}:`, error);
      throw error;
    }
  },

  async getServiceDetails(serviceId) {
    try {
      const service = await Service.findById(serviceId);
      if (!service) {
        throw new Error('Service not found');
      }
      return service;
    } catch (error) {
      logger.error(`Error fetching service details for ID ${serviceId}:`, error);
      throw error;
    }
  },
};

module.exports = dataService; 
