const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

// ============================================================
//  ELECTRONICS  (20 products)
// ============================================================
const electronics = [
  {
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 149.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock: 25, rating: 4.5, numReviews: 12,
  },
  {
    name: 'Mechanical Keyboard RGB',
    description: 'Tactile mechanical keyboard with customizable RGB lighting and USB-C connectivity.',
    price: 119.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400',
    stock: 15, rating: 4.7, numReviews: 22,
  },
  {
    name: 'Smart Watch Series X',
    description: 'Feature-rich smartwatch with health tracking, GPS, and 7-day battery life.',
    price: 299.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    stock: 10, rating: 4.8, numReviews: 30,
  },
  {
    name: '4K Gaming Monitor 27"',
    description: '27-inch 4K IPS monitor with 144Hz refresh rate, HDR support and ultra-thin bezels.',
    price: 449.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
    stock: 8, rating: 4.6, numReviews: 19,
  },
  {
    name: 'Wireless Earbuds Pro',
    description: 'True wireless earbuds with active noise cancellation, 24-hour battery and IPX5 rating.',
    price: 89.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400',
    stock: 30, rating: 4.4, numReviews: 45,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: '360-degree surround sound speaker, waterproof design with 20-hour playtime.',
    price: 79.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    stock: 22, rating: 4.3, numReviews: 17,
  },
  {
    name: 'USB-C Laptop Stand Hub',
    description: 'Aluminum adjustable laptop stand with built-in USB-C hub, 4K HDMI and fast charging.',
    price: 69.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400',
    stock: 18, rating: 4.2, numReviews: 11,
  },
  {
    name: 'Webcam 4K Ultra HD',
    description: 'Professional 4K webcam with built-in ring light, noise-cancelling mic and wide-angle lens.',
    price: 129.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400',
    stock: 12, rating: 4.5, numReviews: 28,
  },
  {
    name: 'Gaming Mouse Pro RGB',
    description: 'High-precision gaming mouse with 16000 DPI, RGB lighting and 8 programmable buttons.',
    price: 59.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
    stock: 35, rating: 4.6, numReviews: 33,
  },
  {
    name: 'Wireless Charging Pad 15W',
    description: 'Fast 15W wireless charger compatible with all Qi-enabled devices. Slim and sleek design.',
    price: 29.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=400',
    stock: 50, rating: 4.1, numReviews: 24,
  },
  {
    name: 'Laptop Sleeve 15"',
    description: 'Water-resistant neoprene laptop sleeve with accessory pocket fits up to 15.6-inch laptops.',
    price: 24.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
    stock: 40, rating: 4.2, numReviews: 16,
  },
  {
    name: 'Smart Home Hub',
    description: 'Central smart home controller compatible with Alexa, Google Home and 10,000+ devices.',
    price: 99.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400',
    stock: 14, rating: 4.4, numReviews: 38,
  },
  {
    name: 'Noise Cancelling Earphones',
    description: 'Wired noise-cancelling earphones with microphone, compatible with all 3.5mm devices.',
    price: 39.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
    stock: 28, rating: 4.0, numReviews: 20,
  },
  {
    name: 'Portable Power Bank 20000mAh',
    description: '20000mAh power bank with dual USB-A and USB-C ports, fast charging and LED indicator.',
    price: 49.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
    stock: 45, rating: 4.5, numReviews: 52,
  },
  {
    name: 'Digital Drawing Tablet',
    description: 'Professional graphic tablet with 8192 pressure levels, tilt support and 10 express keys.',
    price: 179.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400',
    stock: 9, rating: 4.7, numReviews: 29,
  },
  {
    name: 'Smart LED Strip Lights',
    description: 'WiFi-enabled RGB LED strip lights, 5m, works with Alexa and Google, 16 million colors.',
    price: 34.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=400',
    stock: 60, rating: 4.3, numReviews: 44,
  },
  {
    name: 'VR Headset Standalone',
    description: 'All-in-one VR headset with 4K display, 6DOF tracking and 3-hour battery life.',
    price: 399.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400',
    stock: 6, rating: 4.6, numReviews: 35,
  },
  {
    name: 'Mini Projector Portable',
    description: '1080p portable mini projector, 200" display, built-in speaker and HDMI/USB input.',
    price: 219.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=400',
    stock: 11, rating: 4.4, numReviews: 23,
  },
  {
    name: 'External SSD 1TB',
    description: 'Ultra-fast 1TB external SSD with USB-C, read speeds up to 1050MB/s, shock resistant.',
    price: 109.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1597225244516-8b776b960e51?w=400',
    stock: 20, rating: 4.8, numReviews: 61,
  },
  {
    name: 'Drone Camera 4K',
    description: 'Foldable 4K drone with 3-axis gimbal, 30-min flight time and obstacle avoidance.',
    price: 549.99, category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400',
    stock: 5, rating: 4.7, numReviews: 48,
  },
];

// ============================================================
//  SHOES  (20 products)
// ============================================================
const shoes = [
  {
    name: 'Running Sneakers Pro',
    description: 'Lightweight and durable running shoes designed for maximum performance.',
    price: 89.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    stock: 40, rating: 4.2, numReviews: 8,
  },
  {
    name: 'Classic White Sneakers',
    description: 'Timeless white leather sneakers with cushioned sole and premium stitching.',
    price: 74.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400',
    stock: 55, rating: 4.5, numReviews: 36,
  },
  {
    name: 'Hiking Boots Waterproof',
    description: 'Heavy-duty waterproof hiking boots with ankle support and grippy rubber outsole.',
    price: 134.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1520219306100-ec4afeeefe58?w=400',
    stock: 20, rating: 4.7, numReviews: 14,
  },
  {
    name: 'Slip-On Suede Loafers',
    description: 'Comfortable suede slip-on loafers perfect for casual and semi-formal occasions.',
    price: 64.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400',
    stock: 30, rating: 4.0, numReviews: 9,
  },
  {
    name: 'High-Top Basketball Shoes',
    description: 'Professional basketball shoes with ankle support, responsive cushioning and non-slip sole.',
    price: 109.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    stock: 18, rating: 4.4, numReviews: 21,
  },
  {
    name: 'Summer Sandals EVA',
    description: 'Lightweight EVA sandals with adjustable straps and arch support for all-day comfort.',
    price: 44.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400',
    stock: 45, rating: 4.1, numReviews: 16,
  },
  {
    name: 'Chelsea Boots Leather',
    description: 'Classic pull-on Chelsea boots in genuine leather with elastic side panels.',
    price: 129.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400',
    stock: 22, rating: 4.6, numReviews: 27,
  },
  {
    name: 'Gym Training Shoes',
    description: 'Cross-training shoes with wide toe box, flat sole for weightlifting and gym workouts.',
    price: 84.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
    stock: 33, rating: 4.3, numReviews: 19,
  },
  {
    name: 'Oxford Dress Shoes',
    description: 'Premium full-grain leather Oxford shoes with leather sole and cushioned insole.',
    price: 159.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400',
    stock: 15, rating: 4.5, numReviews: 31,
  },
  {
    name: 'Casual Canvas Shoes',
    description: 'Lightweight canvas shoes with rubber sole, available in 8 colors. Unisex design.',
    price: 39.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400',
    stock: 70, rating: 4.0, numReviews: 42,
  },
  {
    name: 'Trail Running Shoes',
    description: 'Off-road trail running shoes with aggressive lugs, rock plate and waterproof upper.',
    price: 119.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
    stock: 25, rating: 4.6, numReviews: 24,
  },
  {
    name: 'Platform Sneakers',
    description: 'Chunky platform sneakers with 5cm sole, leather upper and memory foam insole.',
    price: 94.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400',
    stock: 28, rating: 4.2, numReviews: 18,
  },
  {
    name: 'Flip Flops Premium',
    description: 'Ergonomic flip flops with contoured footbed, quick-dry straps and non-slip sole.',
    price: 29.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400',
    stock: 80, rating: 3.9, numReviews: 13,
  },
  {
    name: 'Ankle Boots Suede',
    description: 'Trendy ankle boots in soft suede with block heel and side zip closure.',
    price: 114.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400',
    stock: 20, rating: 4.4, numReviews: 22,
  },
  {
    name: 'Slip-On Running Shoes',
    description: 'Sock-style slip-on running shoes with Flyknit upper and responsive foam sole.',
    price: 79.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400',
    stock: 38, rating: 4.3, numReviews: 29,
  },
  {
    name: 'Winter Snow Boots',
    description: 'Insulated snow boots rated to -30°C with waterproof shell and non-slip outsole.',
    price: 144.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1608256246200-f8e3e5c8e88b?w=400',
    stock: 16, rating: 4.7, numReviews: 35,
  },
  {
    name: 'Moccasin Slippers',
    description: 'Indoor moccasin slippers in sheepskin with memory foam insole and rubber sole.',
    price: 49.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400',
    stock: 55, rating: 4.5, numReviews: 47,
  },
  {
    name: 'Cycling Shoes Clipless',
    description: 'Road cycling shoes with carbon fiber sole, BOA fit system and 3-bolt cleat compatibility.',
    price: 189.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=400',
    stock: 10, rating: 4.6, numReviews: 17,
  },
  {
    name: 'Espadrille Wedge Shoes',
    description: 'Summer espadrille wedge shoes with jute sole and canvas upper, 6cm heel.',
    price: 54.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=400',
    stock: 24, rating: 4.1, numReviews: 11,
  },
  {
    name: 'Steel Toe Work Boots',
    description: 'Safety work boots with steel toe cap, puncture-resistant sole and electrical hazard protection.',
    price: 164.99, category: 'Shoes',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400',
    stock: 18, rating: 4.5, numReviews: 26,
  },
];

// ============================================================
//  ACCESSORIES  (20 products)
// ============================================================
const accessories = [
  {
    name: 'Leather Wallet Slim',
    description: 'Genuine leather slim wallet with RFID blocking technology and 8 card slots.',
    price: 39.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
    stock: 60, rating: 4.0, numReviews: 5,
  },
  {
    name: 'Polarized Sunglasses',
    description: 'UV400 polarized sunglasses with lightweight titanium frame and anti-glare coating.',
    price: 54.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400',
    stock: 40, rating: 4.3, numReviews: 27,
  },
  {
    name: 'Leather Belt Premium',
    description: 'Full-grain leather belt with brushed silver buckle. Available in black and brown.',
    price: 34.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400',
    stock: 35, rating: 4.2, numReviews: 13,
  },
  {
    name: 'Wool Scarf Classic',
    description: 'Soft merino wool scarf in neutral tones. 180cm length, perfect for cold weather.',
    price: 29.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400',
    stock: 50, rating: 4.4, numReviews: 10,
  },
  {
    name: 'Baseball Cap Snapback',
    description: 'Adjustable snapback cap with embroidered logo and moisture-wicking sweatband.',
    price: 24.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
    stock: 70, rating: 4.0, numReviews: 19,
  },
  {
    name: 'Silver Chain Necklace',
    description: '925 sterling silver chain necklace, 50cm length with lobster clasp closure.',
    price: 49.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
    stock: 25, rating: 4.6, numReviews: 31,
  },
  {
    name: 'Leather Gloves Winter',
    description: 'Genuine leather winter gloves with cashmere lining and touchscreen-compatible fingertips.',
    price: 44.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1545346315-f4c47e3e1b55?w=400',
    stock: 30, rating: 4.3, numReviews: 15,
  },
  {
    name: 'Gold Hoop Earrings',
    description: '18k gold-plated hoop earrings, 3cm diameter, hypoallergenic and tarnish-resistant.',
    price: 27.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
    stock: 45, rating: 4.5, numReviews: 38,
  },
  {
    name: 'Beanie Knit Hat',
    description: 'Warm ribbed knit beanie in 100% acrylic, available in 10 colors. One size fits all.',
    price: 19.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400',
    stock: 80, rating: 4.1, numReviews: 22,
  },
  {
    name: 'Stainless Steel Watch',
    description: 'Minimalist stainless steel quartz watch with sapphire crystal glass and 5ATM water resistance.',
    price: 129.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    stock: 20, rating: 4.7, numReviews: 44,
  },
  {
    name: 'Silk Tie Collection',
    description: '100% pure silk tie with hand-rolled edges, available in 15 patterns and colors.',
    price: 32.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400',
    stock: 40, rating: 4.2, numReviews: 9,
  },
  {
    name: 'Leather Card Holder',
    description: 'Slim genuine leather card holder with 6 card slots and center pocket for cash.',
    price: 22.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=400',
    stock: 55, rating: 4.0, numReviews: 17,
  },
  {
    name: 'Titanium Bracelet',
    description: 'Lightweight titanium chain bracelet with magnetic clasp, hypoallergenic and rust-proof.',
    price: 37.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94815b1?w=400',
    stock: 35, rating: 4.4, numReviews: 26,
  },
  {
    name: 'Fedora Hat',
    description: 'Classic wool fedora hat with grosgrain ribbon band. Available in black, grey and brown.',
    price: 42.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=400',
    stock: 28, rating: 4.3, numReviews: 14,
  },
  {
    name: 'Bow Tie Set',
    description: 'Set of 3 pre-tied bow ties in classic patterns: solid, striped and polka dot.',
    price: 28.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400',
    stock: 45, rating: 3.9, numReviews: 8,
  },
  {
    name: 'Rose Gold Ring',
    description: 'Minimalist rose gold-plated ring with cubic zirconia stone, adjustable size.',
    price: 24.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
    stock: 50, rating: 4.5, numReviews: 33,
  },
  {
    name: 'Umbrella Windproof',
    description: 'Compact windproof umbrella with fiberglass frame, auto open/close and UV protection.',
    price: 26.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553272725-086100aecf5e?w=400',
    stock: 60, rating: 4.2, numReviews: 21,
  },
  {
    name: 'Aviator Sunglasses',
    description: 'Classic aviator sunglasses with polarized lenses, metal frame and UV400 protection.',
    price: 49.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=400',
    stock: 38, rating: 4.4, numReviews: 29,
  },
  {
    name: 'Pocket Square Set',
    description: 'Set of 5 premium cotton pocket squares in assorted colors. Hand-rolled edges.',
    price: 19.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400',
    stock: 65, rating: 4.0, numReviews: 7,
  },
  {
    name: 'Leather Keychain',
    description: 'Handcrafted full-grain leather keychain with brass hardware and personalization option.',
    price: 14.99, category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1614267861476-0d129972a0f4?w=400',
    stock: 90, rating: 4.3, numReviews: 41,
  },
];

// ============================================================
//  BAGS  (20 products)
// ============================================================
const bags = [
  {
    name: 'Canvas Backpack 30L',
    description: 'Durable 30L canvas backpack with laptop compartment and water-resistant coating.',
    price: 59.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    stock: 35, rating: 4.3, numReviews: 15,
  },
  {
    name: 'Leather Messenger Bag',
    description: 'Full-grain leather messenger bag with padded laptop sleeve and multiple compartments.',
    price: 149.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    stock: 15, rating: 4.7, numReviews: 22,
  },
  {
    name: 'Gym Duffle Bag 40L',
    description: 'Large 40L gym bag with separate shoe compartment, wet pocket and adjustable strap.',
    price: 49.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    stock: 28, rating: 4.2, numReviews: 18,
  },
  {
    name: 'Mini Crossbody Bag',
    description: 'Compact vegan leather crossbody bag with gold chain strap and magnetic closure.',
    price: 44.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
    stock: 22, rating: 4.5, numReviews: 29,
  },
  {
    name: 'Travel Trolley Suitcase 28"',
    description: '28-inch hardshell trolley with TSA lock, spinner wheels and expandable design.',
    price: 189.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400',
    stock: 12, rating: 4.6, numReviews: 41,
  },
  {
    name: 'Leather Tote Bag',
    description: 'Spacious genuine leather tote bag with interior zip pocket and magnetic snap closure.',
    price: 119.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400',
    stock: 18, rating: 4.5, numReviews: 33,
  },
  {
    name: 'Laptop Backpack Anti-Theft',
    description: 'Anti-theft backpack with hidden zipper, USB charging port and 15.6" laptop compartment.',
    price: 69.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400',
    stock: 30, rating: 4.4, numReviews: 37,
  },
  {
    name: 'Clutch Evening Bag',
    description: 'Elegant satin clutch bag with rhinestone clasp, detachable wrist strap and mirror inside.',
    price: 34.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400',
    stock: 25, rating: 4.3, numReviews: 19,
  },
  {
    name: 'Hiking Daypack 20L',
    description: '20L daypack with hydration reservoir compatible, rain cover and ergonomic back panel.',
    price: 79.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=400',
    stock: 20, rating: 4.6, numReviews: 28,
  },
  {
    name: 'Fanny Pack Waist Bag',
    description: 'Retro fanny pack with adjustable strap, multiple compartments and water-resistant fabric.',
    price: 27.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    stock: 45, rating: 4.0, numReviews: 24,
  },
  {
    name: 'Straw Beach Bag',
    description: 'Handwoven straw beach tote with cotton lining, zip inner pocket and magnetic closure.',
    price: 39.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400',
    stock: 32, rating: 4.2, numReviews: 16,
  },
  {
    name: 'Briefcase Leather',
    description: 'Professional full-grain leather briefcase with combination lock and shoulder strap.',
    price: 199.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    stock: 10, rating: 4.7, numReviews: 21,
  },
  {
    name: 'Diaper Bag Backpack',
    description: 'Large capacity diaper bag with insulated pockets, changing pad and stroller straps.',
    price: 54.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400',
    stock: 22, rating: 4.5, numReviews: 43,
  },
  {
    name: 'Camera Bag DSLR',
    description: 'Padded DSLR camera bag with removable dividers, rain cover and tripod attachment.',
    price: 64.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    stock: 16, rating: 4.4, numReviews: 25,
  },
  {
    name: 'Drawstring Bag Sport',
    description: 'Lightweight polyester drawstring bag, 15L capacity, perfect for gym and casual use.',
    price: 14.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    stock: 75, rating: 3.9, numReviews: 12,
  },
  {
    name: 'Bucket Bag Leather',
    description: 'Trendy genuine leather bucket bag with drawstring closure and adjustable strap.',
    price: 89.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
    stock: 19, rating: 4.3, numReviews: 20,
  },
  {
    name: 'Tactical Military Bag',
    description: 'Heavy-duty 45L tactical backpack with MOLLE system, multiple pockets and laptop sleeve.',
    price: 74.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400',
    stock: 24, rating: 4.5, numReviews: 32,
  },
  {
    name: 'Eco Reusable Tote',
    description: 'Heavy-duty cotton canvas reusable tote bag, 15kg capacity, machine washable.',
    price: 12.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400',
    stock: 100, rating: 4.1, numReviews: 55,
  },
  {
    name: 'Shoulder Bag Suede',
    description: 'Soft suede shoulder bag with fringe detail, multiple compartments and zip closure.',
    price: 67.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400',
    stock: 21, rating: 4.2, numReviews: 18,
  },
  {
    name: 'Carry-On Cabin Bag',
    description: '20" cabin-approved carry-on with 4 spinner wheels, TSA lock and expandable zipper.',
    price: 129.99, category: 'Bags',
    image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400',
    stock: 14, rating: 4.6, numReviews: 38,
  },
];

// ============================================================
//  HOME  (20 products)
// ============================================================
const home = [
  {
    name: 'Coffee Maker Deluxe',
    description: 'Programmable 12-cup coffee maker with built-in grinder and thermal carafe.',
    price: 79.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    stock: 20, rating: 4.1, numReviews: 9,
  },
  {
    name: 'Air Purifier HEPA',
    description: 'True HEPA air purifier covering 500 sq ft, removes 99.97% of airborne particles.',
    price: 129.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400',
    stock: 14, rating: 4.5, numReviews: 23,
  },
  {
    name: 'Scented Candle Set',
    description: 'Set of 4 hand-poured soy wax candles in lavender, vanilla, cedar and citrus.',
    price: 34.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400',
    stock: 60, rating: 4.7, numReviews: 52,
  },
  {
    name: 'Smart LED Desk Lamp',
    description: 'Touch-control LED desk lamp with 5 color modes, USB charging port and memory function.',
    price: 44.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    stock: 30, rating: 4.4, numReviews: 37,
  },
  {
    name: 'Non-Stick Cookware Set',
    description: '10-piece non-stick cookware set with tempered glass lids, oven safe up to 500F.',
    price: 119.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1584990347449-39ce4ab80e51?w=400',
    stock: 16, rating: 4.3, numReviews: 28,
  },
  {
    name: 'Throw Blanket Sherpa',
    description: 'Ultra-soft sherpa fleece throw blanket, 150x200cm. Machine washable in 6 colors.',
    price: 39.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=400',
    stock: 45, rating: 4.8, numReviews: 64,
  },
  {
    name: 'Wall Art Canvas Print',
    description: 'Modern abstract canvas wall art, ready to hang. Available in 3 sizes.',
    price: 54.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400',
    stock: 20, rating: 4.2, numReviews: 15,
  },
  {
    name: 'Electric Kettle 1.7L',
    description: 'Fast-boil 1.7L electric kettle with temperature control, keep-warm and auto shut-off.',
    price: 49.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    stock: 28, rating: 4.4, numReviews: 41,
  },
  {
    name: 'Robot Vacuum Cleaner',
    description: 'Smart robot vacuum with mapping, auto-empty base, 3-hour runtime and app control.',
    price: 299.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    stock: 8, rating: 4.6, numReviews: 57,
  },
  {
    name: 'Bamboo Cutting Board Set',
    description: 'Set of 3 organic bamboo cutting boards with juice grooves, handles and non-slip feet.',
    price: 32.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    stock: 40, rating: 4.3, numReviews: 29,
  },
  {
    name: 'Plant Pot Set Ceramic',
    description: 'Set of 4 minimalist ceramic plant pots with drainage holes and bamboo trays.',
    price: 27.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400',
    stock: 35, rating: 4.5, numReviews: 44,
  },
  {
    name: 'Pillow Set Memory Foam',
    description: 'Set of 2 memory foam pillows with cooling gel layer and removable washable covers.',
    price: 64.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
    stock: 22, rating: 4.6, numReviews: 51,
  },
  {
    name: 'Kitchen Scale Digital',
    description: 'Precision digital kitchen scale with 0.1g accuracy, tare function and LCD display.',
    price: 19.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    stock: 50, rating: 4.2, numReviews: 33,
  },
  {
    name: 'Shower Head Rainfall',
    description: '12-inch rainfall shower head with 304 stainless steel, 5 spray modes and easy install.',
    price: 44.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400',
    stock: 25, rating: 4.4, numReviews: 26,
  },
  {
    name: 'Diffuser Essential Oil',
    description: '500ml ultrasonic aromatherapy diffuser with 7 LED colors, timer and auto shut-off.',
    price: 29.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400',
    stock: 38, rating: 4.5, numReviews: 48,
  },
  {
    name: 'Bookshelf Floating Set',
    description: 'Set of 3 invisible floating wall shelves, holds up to 15kg each, easy mounting.',
    price: 37.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    stock: 30, rating: 4.1, numReviews: 19,
  },
  {
    name: 'Blender High Speed',
    description: 'Professional 1500W high-speed blender with 64oz jar, 10 speeds and self-cleaning mode.',
    price: 89.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400',
    stock: 18, rating: 4.7, numReviews: 62,
  },
  {
    name: 'Bathroom Organizer Set',
    description: 'Set of 5 clear acrylic bathroom organizers for countertop storage, easy to clean.',
    price: 23.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400',
    stock: 42, rating: 4.0, numReviews: 22,
  },
  {
    name: 'Weighted Blanket 15lb',
    description: '15lb weighted blanket with glass bead fill, breathable cotton cover, 60x80 inches.',
    price: 74.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=400',
    stock: 20, rating: 4.6, numReviews: 55,
  },
  {
    name: 'Air Fryer 5.8QT',
    description: '5.8QT digital air fryer with 8 presets, touchscreen, dishwasher-safe basket.',
    price: 99.99, category: 'Home',
    image: 'https://images.unsplash.com/photo-1584990347449-39ce4ab80e51?w=400',
    stock: 15, rating: 4.8, numReviews: 73,
  },
];

// ============================================================
//  SPORTS  (20 products)
// ============================================================
const sports = [
  {
    name: 'Yoga Mat Premium',
    description: 'Extra-thick non-slip yoga mat with alignment lines and carrying strap.',
    price: 34.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1601925228997-2c27c8e49bc4?w=400',
    stock: 50, rating: 4.6, numReviews: 18,
  },
  {
    name: 'Adjustable Dumbbell Set',
    description: 'Space-saving adjustable dumbbells from 5 to 52.5 lbs, replaces 15 sets of weights.',
    price: 299.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
    stock: 10, rating: 4.8, numReviews: 47,
  },
  {
    name: 'Resistance Bands Set',
    description: 'Set of 5 resistance bands from 10 to 50 lbs with handles, ankle straps and door anchor.',
    price: 24.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400',
    stock: 65, rating: 4.4, numReviews: 39,
  },
  {
    name: 'Foam Roller Deep Tissue',
    description: 'High-density EVA foam roller for muscle recovery, 33cm with textured surface.',
    price: 19.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
    stock: 55, rating: 4.3, numReviews: 26,
  },
  {
    name: 'Jump Rope Speed',
    description: 'Adjustable speed jump rope with ball bearings, aluminum handles and digital counter.',
    price: 14.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400',
    stock: 80, rating: 4.2, numReviews: 33,
  },
  {
    name: 'Water Bottle Insulated',
    description: 'Double-wall insulated stainless steel water bottle, cold 24h or hot 12h, 32oz.',
    price: 27.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    stock: 90, rating: 4.7, numReviews: 58,
  },
  {
    name: 'Running Belt Waist Pack',
    description: 'Slim running belt with phone pocket, key clip and water-resistant zipper.',
    price: 17.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400',
    stock: 45, rating: 4.1, numReviews: 21,
  },
  {
    name: 'Pull Up Bar Doorway',
    description: 'No-screw doorway pull-up bar, fits 24-36 inch frames, holds up to 300 lbs.',
    price: 34.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
    stock: 40, rating: 4.5, numReviews: 44,
  },
  {
    name: 'Kettlebell Cast Iron 20kg',
    description: 'Cast iron kettlebell with flat base, powder coat finish and wide handle for easy grip.',
    price: 49.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
    stock: 30, rating: 4.4, numReviews: 31,
  },
  {
    name: 'Gym Gloves Weightlifting',
    description: 'Padded weightlifting gloves with wrist support, full palm protection and anti-slip grip.',
    price: 22.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
    stock: 55, rating: 4.2, numReviews: 28,
  },
  {
    name: 'Fitness Tracker Band',
    description: 'Smart fitness tracker with heart rate monitor, sleep tracking, 7-day battery and IP68.',
    price: 59.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
    stock: 35, rating: 4.3, numReviews: 52,
  },
  {
    name: 'Boxing Gloves Pro',
    description: 'Professional boxing gloves in genuine leather with triple foam protection, 12oz.',
    price: 64.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
    stock: 20, rating: 4.6, numReviews: 37,
  },
  {
    name: 'Cycling Helmet Safety',
    description: 'Road cycling helmet with 21 vents, MIPS protection system and adjustable fit dial.',
    price: 79.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=400',
    stock: 18, rating: 4.5, numReviews: 29,
  },
  {
    name: 'Ab Roller Wheel',
    description: 'Double ab roller wheel with knee pad, non-slip handles and 300lb weight capacity.',
    price: 19.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
    stock: 60, rating: 4.1, numReviews: 45,
  },
  {
    name: 'Swimming Goggles Anti-Fog',
    description: 'Professional anti-fog swimming goggles with UV protection, wide vision and silicone seal.',
    price: 16.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400',
    stock: 70, rating: 4.3, numReviews: 38,
  },
  {
    name: 'Trekking Poles Foldable',
    description: 'Lightweight carbon fiber trekking poles, foldable to 38cm, cork handles and carbide tips.',
    price: 54.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
    stock: 25, rating: 4.4, numReviews: 23,
  },
  {
    name: 'Gym Bench Adjustable',
    description: 'Adjustable weight bench with 7 back positions, 3 seat positions, 600lb capacity.',
    price: 149.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
    stock: 10, rating: 4.7, numReviews: 41,
  },
  {
    name: 'Protein Shaker Bottle',
    description: 'Leak-proof 700ml protein shaker with stainless steel whisk ball and measurement marks.',
    price: 12.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    stock: 100, rating: 4.0, numReviews: 67,
  },
  {
    name: 'Skateboard Complete',
    description: 'Complete skateboard with 7-ply maple deck, ABEC-7 bearings and 52mm wheels.',
    price: 69.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=400',
    stock: 22, rating: 4.2, numReviews: 19,
  },
  {
    name: 'Compression Socks Set',
    description: 'Set of 3 pairs graduated compression socks for running, travel and recovery, 20-30mmHg.',
    price: 21.99, category: 'Sports',
    image: 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=400',
    stock: 75, rating: 4.3, numReviews: 56,
  },
];

// ============================================================
//  MERGE ALL CATEGORIES IN ORDER
// ============================================================
const sampleProducts = [
  ...electronics,
  ...shoes,
  ...accessories,
  ...bags,
  ...home,
  ...sports,
];

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
  await Product.deleteMany();
  await User.deleteMany();

  await User.create({
    name: 'Abdulaziz',
    email: 'abdulazizabduraxmonov.2903@gmail.com',
    password: 'Abdulaziz2903',
    isAdmin: true,
  });

  await User.create({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'john123',
  });

  await Product.insertMany(sampleProducts);

  console.log('✅ Database seeded successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📦 Electronics : ${electronics.length} products`);
  console.log(`👟 Shoes       : ${shoes.length} products`);
  console.log(`⌚ Accessories : ${accessories.length} products`);
  console.log(`👜 Bags        : ${bags.length} products`);
  console.log(`🏠 Home        : ${home.length} products`);
  console.log(`⚽ Sports      : ${sports.length} products`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🛍  Total      : ${sampleProducts.length} products`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 Admin : abdulazizabduraxmonov.2903@gmail.com / Abdulaziz2903');
  console.log('👤 User  : john@example.com / john123');
  process.exit();
};

seedDB().catch((err) => { console.error(err); process.exit(1); });