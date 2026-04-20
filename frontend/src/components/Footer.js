import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="e-footer">
    <div className="e-footer-top">
      <div className="container e-footer-top-inner">
        <div className="e-footer-brand">
          <span>⚡ SHOPZONE™</span>
          <p>Premium products. Bold prices. Fast delivery. 120+ items across 6 categories.</p>
        </div>
        <div className="e-footer-links-grid">
          <div>
            <h4>SHOP</h4>
            <Link to="/products?category=Electronics">Electronics</Link>
            <Link to="/products?category=Shoes">Shoes</Link>
            <Link to="/products?category=Accessories">Accessories</Link>
            <Link to="/products?category=Bags">Bags</Link>
            <Link to="/products?category=Home">Home</Link>
            <Link to="/products?category=Sports">Sports</Link>
          </div>
          <div>
            <h4>ACCOUNT</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
            <Link to="/profile">My Profile</Link>
            <Link to="/my-orders">My Orders</Link>
            <Link to="/cart">Cart</Link>
          </div>
          <div>
            <h4>SUPPORT</h4>
            <Link to="/">Help Center</Link>
            <Link to="/">Track Order</Link>
            <Link to="/">Returns</Link>
            <Link to="/">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
    <div className="e-footer-bottom">
      <div className="container e-footer-bottom-inner">
        <p>© {new Date().getFullYear()} SHOPZONE. ALL RIGHTS RESERVED.</p>
        <div className="e-footer-bottom-links">
          <Link to="/">TERMS</Link>
          <Link to="/">PRIVACY</Link>
          <Link to="/">COOKIES</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;