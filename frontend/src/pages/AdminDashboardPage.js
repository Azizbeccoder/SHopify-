import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './AdminPage.css';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/orders'),
      api.get('/products'),
      api.get('/users'),
    ]).then(([o, p, u]) => {
      setOrders(o.data);
      setProducts(p.data);
      setUsers(u.data);
      setLoading(false);
    });
  }, []);

  const totalRevenue = orders.filter(o => o.isPaid).reduce((acc, o) => acc + o.totalPrice, 0);
  const pendingOrders = orders.filter(o => !o.isDelivered).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const topProducts = [...products].sort((a, b) => b.numReviews - a.numReviews).slice(0, 5);

  const STAT_CARDS = [
    { icon: '💰', label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, change: '+12.5%', up: true, bg: 'rgba(108,99,255,0.15)', color: '#6c63ff' },
    { icon: '📦', label: 'Total Orders', value: orders.length, change: '+8.2%', up: true, bg: 'rgba(0,214,143,0.12)', color: '#00d68f' },
    { icon: '🛍', label: 'Products', value: products.length, change: `${outOfStock} out of stock`, up: false, bg: 'rgba(255,170,0,0.12)', color: '#ffaa00' },
    { icon: '👥', label: 'Customers', value: users.length, change: '+3 this week', up: true, bg: 'rgba(255,101,132,0.12)', color: '#ff6584' },
  ];

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div className="admin-header-left">
            <h1>Dashboard</h1>
            <p>Welcome back, Admin! Here's what's happening today.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/admin/products" className="btn btn-primary btn-sm">+ Add Product</Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="admin-stats">
          {STAT_CARDS.map((s) => (
            <div key={s.label} className="admin-stat-card">
              <div className="admin-stat-icon" style={{ background: s.bg }}>
                <span>{s.icon}</span>
              </div>
              <div className="admin-stat-info">
                <strong style={{ color: s.color }}>{s.value}</strong>
                <span>{s.label}</span>
                <div className={`stat-change ${s.up ? 'stat-up' : 'stat-down'}`}>
                  {s.up ? '↑' : '↓'} {s.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-grid">
          {/* Recent Orders */}
          <div className="table-card">
            <div className="table-card-header">
              <h3>Recent Orders</h3>
              <Link to="/admin/orders" className="btn btn-secondary btn-sm">View All</Link>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o._id}>
                    <td style={{ fontFamily: 'monospace', color: 'var(--gray)', fontSize: '0.8rem' }}>
                      #{o._id.slice(-8)}
                    </td>
                    <td>{o.user?.name || 'N/A'}</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>${o.totalPrice.toFixed(2)}</td>
                    <td>
                      {o.isDelivered
                        ? <span className="badge badge-success">Delivered</span>
                        : o.isPaid
                          ? <span className="badge badge-warning">Processing</span>
                          : <span className="badge badge-danger">Unpaid</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top Products */}
          <div className="table-card">
            <div className="table-card-header">
              <h3>Top Products</h3>
              <Link to="/admin/products" className="btn btn-secondary btn-sm">View All</Link>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="table-product-info">
                        <img src={p.image} alt={p.name} className="table-product-img" />
                        <span className="table-product-name" style={{ fontSize: '0.82rem' }}>
                          {p.name.length > 22 ? p.name.slice(0, 22) + '...' : p.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>${p.price}</td>
                    <td>
                      <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>{p.stock}</span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--warning)' }}>★</span> {p.rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="quick-links">
          <Link to="/admin/products" className="quick-link-card">
            <span>📦</span>
            <div>
              <h4>Manage Products</h4>
              <p>{products.length} products total</p>
            </div>
            <span className="quick-link-arrow">→</span>
          </Link>
          <Link to="/admin/orders" className="quick-link-card">
            <span>🛒</span>
            <div>
              <h4>Manage Orders</h4>
              <p>{pendingOrders} pending delivery</p>
            </div>
            <span className="quick-link-arrow">→</span>
          </Link>
          <Link to="/admin/users" className="quick-link-card">
            <span>👥</span>
            <div>
              <h4>Manage Users</h4>
              <p>{users.length} registered users</p>
            </div>
            <span className="quick-link-arrow">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;