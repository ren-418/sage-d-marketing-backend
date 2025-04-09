const mongoose = require('mongoose');
const Product = require('../models/Product');
const ServiceCenter = require('../models/ServiceCenter');

const products = [
  {
    name: "iPhone 15 Pro",
    brand: "Apple",
    model: "iPhone 15 Pro",
    description: "The latest iPhone with A17 Pro chip, titanium design, and advanced camera system",
    price: 24999,
    stock: 15,
    features: [
      "A17 Pro chip",
      "Titanium design",
      "48MP camera system",
      "USB-C port",
      "Dynamic Island"
    ],
    specifications: {
      "Display": "6.1-inch Super Retina XDR",
      "Processor": "A17 Pro",
      "Storage": "128GB",
      "Camera": "48MP + 12MP + 12MP",
      "Battery": "Up to 23 hours video playback"
    },
    category: "iPhone",
    imageUrl: "https://example.com/iphone15pro.jpg",
    isOnSale: true,
    salePrice: 22999,
    saleEndDate: new Date("2024-12-31")
  },
  {
    name: "Apple Watch Series 9",
    brand: "Apple",
    model: "Apple Watch Series 9",
    description: "Advanced smartwatch with health monitoring and fitness tracking",
    price: 12999,
    stock: 20,
    features: [
      "Always-on Retina display",
      "ECG app",
      "Blood oxygen monitoring",
      "Sleep tracking",
      "Water resistant"
    ],
    specifications: {
      "Display": "Always-on Retina LTPO OLED",
      "Processor": "S9 SiP",
      "Storage": "32GB",
      "Battery": "Up to 18 hours",
      "Water Resistance": "50 meters"
    },
    category: "Apple Watch",
    imageUrl: "https://example.com/watch9.jpg",
    isOnSale: false
  },
  {
    name: "iPad Pro 12.9-inch",
    brand: "Apple",
    model: "iPad Pro 12.9-inch",
    description: "Professional tablet with M2 chip and Liquid Retina XDR display",
    price: 32999,
    stock: 8,
    features: [
      "M2 chip",
      "Liquid Retina XDR display",
      "Face ID",
      "Thunderbolt port",
      "Apple Pencil support"
    ],
    specifications: {
      "Display": "12.9-inch Liquid Retina XDR",
      "Processor": "M2 chip",
      "Storage": "256GB",
      "Camera": "12MP + 10MP",
      "Battery": "Up to 10 hours"
    },
    category: "iPad",
    imageUrl: "https://example.com/ipadpro.jpg",
    isOnSale: true,
    salePrice: 29999,
    saleEndDate: new Date("2024-06-30")
  }
];

const serviceCenters = [
  {
    name: "CellSell Cape Town",
    address: {
      street: "123 Main Road",
      city: "Cape Town",
      province: "Western Cape",
      postalCode: "8001",
      country: "South Africa"
    },
    contact: {
      phone: "+27 21 123 4567",
      email: "capetown@cellsell.co.za"
    },
    operatingHours: {
      "Monday": "9:00 AM - 5:30 PM",
      "Tuesday": "9:00 AM - 5:30 PM",
      "Wednesday": "9:00 AM - 5:30 PM",
      "Thursday": "9:00 AM - 5:30 PM",
      "Friday": "9:00 AM - 5:30 PM",
      "Saturday": "9:00 AM - 1:00 PM",
      "Sunday": "Closed"
    },
    services: [
      "Screen replacement",
      "Battery replacement",
      "Water damage repair",
      "Software troubleshooting",
      "Warranty service"
    ],
    isAuthorized: true,
    location: {
      type: "Point",
      coordinates: [18.4241, -33.9249]
    }
  },
  {
    name: "CellSell Johannesburg",
    address: {
      street: "456 Sandton Drive",
      city: "Johannesburg",
      province: "Gauteng",
      postalCode: "2196",
      country: "South Africa"
    },
    contact: {
      phone: "+27 11 987 6543",
      email: "johannesburg@cellsell.co.za"
    },
    operatingHours: {
      "Monday": "8:30 AM - 6:00 PM",
      "Tuesday": "8:30 AM - 6:00 PM",
      "Wednesday": "8:30 AM - 6:00 PM",
      "Thursday": "8:30 AM - 6:00 PM",
      "Friday": "8:30 AM - 6:00 PM",
      "Saturday": "9:00 AM - 2:00 PM",
      "Sunday": "Closed"
    },
    services: [
      "Screen replacement",
      "Battery replacement",
      "Water damage repair",
      "Software troubleshooting",
      "Warranty service",
      "Data recovery"
    ],
    isAuthorized: true,
    location: {
      type: "Point",
      coordinates: [28.0473, -26.2041]
    }
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await ServiceCenter.deleteMany({});

    // Insert new data
    await Product.insertMany(products);
    await ServiceCenter.insertMany(serviceCenters);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Connect to MongoDB and run the seed
mongoose.connect(process.env.MONGODB_URI, {
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASSWORD,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  seedDatabase();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 