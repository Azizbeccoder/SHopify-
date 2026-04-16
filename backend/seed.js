const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
  {
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 149.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock: 25,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Running Sneakers Pro',
    description: 'Lightweight and durable running shoes designed for maximum performance.',
    price: 89.99,
    category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    stock: 40,
    rating: 4.2,
    numReviews: 8,
  },
  {
    name: 'Mechanical Keyboard RGB',
    description: 'Tactile mechanical keyboard with customizable RGB lighting and USB-C connectivity.',
    price: 119.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400',
    stock: 15,
    rating: 4.7,
    numReviews: 22,
  },
  {
    name: 'Leather Wallet Slim',
    description: 'Genuine leather slim wallet with RFID blocking technology.',
    price: 39.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
    stock: 60,
    rating: 4.0,
    numReviews: 5,
  },
  {
    name: 'Smart Watch Series X',
    description: 'Feature-rich smartwatch with health tracking, GPS, and 7-day battery.',
    price: 299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    stock: 10,
    rating: 4.8,
    numReviews: 30,
  },
  {
    name: 'Canvas Backpack',
    description: 'Durable 30L canvas backpack with laptop compartment and water-resistant coating.',
    price: 59.99,
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    stock: 35,
    rating: 4.3,
    numReviews: 15,
  },
  {
    name: 'Coffee Maker Deluxe',
    description: 'Programmable 12-cup coffee maker with built-in grinder and thermal carafe.',
    price: 79.99,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    stock: 20,
    rating: 4.1,
    numReviews: 9,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra-thick non-slip yoga mat with alignment lines and carrying strap.',
    price: 34.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1601925228997-2c27c8e49bc4?w=400',
    stock: 50,
    rating: 4.6,
    numReviews: 18,
  },
];

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
  await Product.deleteMany();
  await User.deleteMany();

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@shop.com',
    password: 'admin123',
    isAdmin: true,
  });

  await User.create({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'john123',
  });

  await Product.insertMany(sampleProducts);
  console.log('✅ Database seeded!');
  console.log('Admin: admin@shop.com / admin123');
  console.log('User:  john@example.com / john123');
  process.exit();
};

seedDB().catch((err) => { console.error(err); process.exit(1); });
