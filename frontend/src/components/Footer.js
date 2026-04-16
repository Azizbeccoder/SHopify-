import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div className="footer-brand">
        <span>⚡ ShopZone</span>
        <p>The best place to shop online. Quality products, fast delivery.</p>
      </div>
      <div className="footer-links">
        <h4>Shop</h4>
        <Link to="/products">All Products</Link>
        <Link to="/products?category=Electronics">Electronics</Link>
        <Link to="/products?category=Shoes">Shoes</Link>
      </div>
      <div className="footer-links">
        <h4>Account</h4>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/my-orders">My Orders</Link>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} ShopZone. Built with MERN Stack.</p>
    </div>
  </footer>
);

export default Footer;
