import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⚡</span>ShopZone
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Shop</Link>

          <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
            🛒 Cart
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {userInfo ? (
            <div className="dropdown" onMouseLeave={() => setDropOpen(false)}>
              <button className="dropdown-trigger" onClick={() => setDropOpen(!dropOpen)}>
                👤 {userInfo.name.split(' ')[0]} ▾
              </button>
              {dropOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setDropOpen(false)}>Profile</Link>
                  <Link to="/my-orders" onClick={() => setDropOpen(false)}>My Orders</Link>
                  {userInfo.isAdmin && (
                    <>
                      <hr />
                      <Link to="/admin" onClick={() => setDropOpen(false)}>📊 Dashboard</Link>
                      <Link to="/admin/products" onClick={() => setDropOpen(false)}>📦 Products</Link>
                      <Link to="/admin/orders" onClick={() => setDropOpen(false)}>🛒 Orders</Link>
                      <Link to="/admin/users" onClick={() => setDropOpen(false)}>👥 Users</Link>
                    </>
                  )}
                  <hr />
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;