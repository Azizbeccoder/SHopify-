import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-inner">
        <div className="footer-brand">
          <span>⚡ ShopZone</span>
          <p>The best place to shop online. Premium products, fast delivery and unbeatable prices across 6 categories.</p>
          <div className="footer-social">
            <a href="#" title="Twitter">𝕏</a>
            <a href="#" title="Instagram">📸</a>
            <a href="#" title="Facebook">f</a>
            <a href="#" title="YouTube">▶</a>
          </div>
        </div>
        <div className="footer-links">
          <h4>Shop</h4>
          <Link to="/products?category=Electronics">Electronics</Link>
          <Link to="/products?category=Shoes">Shoes</Link>
          <Link to="/products?category=Accessories">Accessories</Link>
          <Link to="/products?category=Bags">Bags</Link>
          <Link to="/products?category=Home">Home</Link>
          <Link to="/products?category=Sports">Sports</Link>
        </div>
        <div className="footer-links">
          <h4>Account</h4>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
          <Link to="/profile">My Profile</Link>
          <Link to="/my-orders">My Orders</Link>
          <Link to="/cart">Cart</Link>
        </div>
        <div className="footer-links">
          <h4>Support</h4>
          <Link to="/">Help Center</Link>
          <Link to="/">Track Order</Link>
          <Link to="/">Returns</Link>
          <Link to="/">Contact Us</Link>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ShopZone. All rights reserved. Built with MERN Stack.</p>
        <div className="footer-bottom-right">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;