# ⚡ ShopZone — MERN Stack E-Commerce

A fully working e-commerce web application built with **MongoDB, Express, React, Node.js** following the **MVC pattern**.

---

## 🗂 Project Structure

```
ecommerce/
├── backend/                  ← Express + Node.js API
│   ├── controllers/          ← Business logic (MVC Controllers)
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── models/               ← Mongoose schemas (MVC Models)
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/               ← Express routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js ← JWT protect + admin guard
│   ├── server.js             ← Entry point
│   ├── seed.js               ← DB seeder with sample data
│   └── .env.example
│
└── frontend/                 ← React app (MVC Views)
    └── src/
        ├── components/       ← Reusable UI components
        │   ├── Navbar.js/css
        │   ├── Footer.js/css
        │   ├── ProductCard.js/css
        │   ├── PrivateRoute.js
        │   └── AdminRoute.js
        ├── pages/            ← Page components
        │   ├── HomePage
        │   ├── ProductsPage  (search + filter)
        │   ├── ProductDetailPage (+ reviews)
        │   ├── CartPage
        │   ├── CheckoutPage  (2-step)
        │   ├── OrderPage
        │   ├── ProfilePage
        │   ├── MyOrdersPage
        │   ├── AdminProductsPage (CRUD)
        │   ├── AdminOrdersPage
        │   └── AdminUsersPage
        ├── context/
        │   ├── AuthContext.js  ← JWT auth state
        │   └── CartContext.js  ← Cart state (persisted)
        └── utils/
            └── api.js          ← Axios with auto token header
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone / Extract the project

### 2. Set up environment variables
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key_here
```

### 3. Install all dependencies
```bash
npm run install-all
```

### 4. Seed the database with sample products & users
```bash
npm run seed
```

### 5. Start the development servers
```bash
npm install          # install concurrently
npm run dev          # starts both backend (port 5000) and frontend (port 3000)
```

Or run separately:
```bash
npm run backend      # http://localhost:5000
npm run frontend     # http://localhost:3000
```

---

## 🔐 Demo Accounts

| Role  | Email              | Password  |
|-------|--------------------|-----------|
| Admin | admin@shop.com     | admin123  |
| User  | john@example.com   | john123   |

---

## ✨ Features

### Customer
- 🏠 Beautiful home page with hero section
- 🔍 Product search & category filter
- 🛍 Product detail with reviews & star ratings
- 🛒 Persistent shopping cart
- 📦 2-step checkout (shipping → review & pay)
- 💳 Order placement & order history
- 👤 Profile management

### Admin Panel
- 📋 Product CRUD (create, edit, delete)
- 📊 Orders management with revenue total
- 👥 User list with roles

### Technical
- 🔐 JWT authentication
- 🛡 Protected routes (private + admin)
- 🗃 MongoDB with Mongoose ODM
- 🏗 MVC architecture
- 📱 Fully responsive design
- 💾 Cart persisted in localStorage

---

## 🛠 API Endpoints

| Method | Endpoint                      | Access  |
|--------|-------------------------------|---------|
| POST   | /api/auth/register            | Public  |
| POST   | /api/auth/login               | Public  |
| GET    | /api/products                 | Public  |
| GET    | /api/products/:id             | Public  |
| POST   | /api/products                 | Admin   |
| PUT    | /api/products/:id             | Admin   |
| DELETE | /api/products/:id             | Admin   |
| POST   | /api/products/:id/reviews     | Private |
| POST   | /api/orders                   | Private |
| GET    | /api/orders/myorders          | Private |
| GET    | /api/orders/:id               | Private |
| PUT    | /api/orders/:id/pay           | Private |
| GET    | /api/orders                   | Admin   |
| PUT    | /api/orders/:id/deliver       | Admin   |
| GET    | /api/users/profile            | Private |
| PUT    | /api/users/profile            | Private |
| GET    | /api/users                    | Admin   |

---

## 🧰 Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | React 18, React Router v6     |
| Styling  | Pure CSS with CSS variables   |
| HTTP     | Axios                         |
| Backend  | Node.js, Express.js           |
| Database | MongoDB, Mongoose             |
| Auth     | JWT, bcryptjs                 |
