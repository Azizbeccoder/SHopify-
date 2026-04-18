import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './AdminPage.css';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [msg, setMsg] = useState('');

  const fetchOrders = () => {
    api.get('/orders').then((res) => {
      setOrders(res.data);
      setFiltered(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    let result = [...orders];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(o =>
        o._id.includes(q) || o.user?.name?.toLowerCase().includes(q) || o.user?.email?.toLowerCase().includes(q)
      );
    }
    if (statusFilter === 'paid') result = result.filter(o => o.isPaid);
    if (statusFilter === 'unpaid') result = result.filter(o => !o.isPaid);
    if (statusFilter === 'delivered') result = result.filter(o => o.isDelivered);
    if (statusFilter === 'pending') result = result.filter(o => !o.isDelivered);
    setFiltered(result);
  }, [search, statusFilter, orders]);

  const handleDeliver = async (id) => {
    try {
      await api.put(`/orders/${id}/deliver`);
      setMsg('✓ Order marked as delivered!');
      fetchOrders();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Error updating order');
    }
  };

  const handlePay = async (id) => {
    try {
      await api.put(`/orders/${id}/pay`);
      setMsg('✓ Order marked as paid!');
      fetchOrders();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Error updating order');
    }
  };

  const totalRevenue = orders.filter(o => o.isPaid).reduce((acc, o) => acc + o.totalPrice, 0);
  const paidCount = orders.filter(o => o.isPaid).length;
  const pendingCount = orders.filter(o => !o.isDelivered).length;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div className="admin-header-left">
            <h1>Orders</h1>
            <p>{orders.length} total orders</p>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(108,99,255,0.15)' }}>💰</div>
            <div className="admin-stat-info">
              <strong style={{ color: 'var(--primary)' }}>${totalRevenue.toFixed(2)}</strong>
              <span>Total Revenue</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(0,214,143,0.12)' }}>✅</div>
            <div className="admin-stat-info">
              <strong style={{ color: 'var(--success)' }}>{paidCount}</strong>
              <span>Paid Orders</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: 'rgba(255,170,0,0.12)' }}>🚚</div>
            <div className="admin-stat-info">
              <strong style={{ color: 'var(--warning)' }}>{pendingCount}</strong>
              <span>Pending Delivery</span>
            </div>
          </div>
        </div>

        {msg && <div className="alert alert-success">{msg}</div>}

        <div className="table-card">
          <div className="table-card-header">
            <h3>All Orders ({filtered.length})</h3>
            <div className="table-search" style={{ gap: 10, flexWrap: 'wrap' }}>
              {/* Status filter */}
              <div style={{ display: 'flex', gap: 6 }}>
                {['all', 'paid', 'unpaid', 'delivered', 'pending'].map(s => (
                  <button
                    key={s}
                    className={`filter-pill ${statusFilter === s ? 'active' : ''}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="🔍 Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="loader-wrap"><div className="loader" /></div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">🛒</div>
              <p>No orders found.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Delivery</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o._id}>
                    <td style={{ fontFamily: 'monospace', color: 'var(--gray)', fontSize: '0.8rem' }}>
                      #{o._id.slice(-8)}
                    </td>
                    <td>
                      <div className="table-user-info">
                        <div className="table-user-avatar">
                          {o.user?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{o.user?.name || 'N/A'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{o.user?.email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>${o.totalPrice.toFixed(2)}</td>
                    <td>
                      {o.isPaid
                        ? <span className="badge badge-success">✓ Paid</span>
                        : <span className="badge badge-danger">Unpaid</span>}
                    </td>
                    <td>
                      {o.isDelivered
                        ? <span className="badge badge-success">✓ Delivered</span>
                        : <span className="badge badge-warning">Pending</span>}
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/orders/${o._id}`} className="btn btn-secondary btn-sm">View</Link>
                        {!o.isPaid && (
                          <button className="btn btn-primary btn-sm" onClick={() => handlePay(o._id)}>
                            Pay
                          </button>
                        )}
                        {o.isPaid && !o.isDelivered && (
                          <button className="btn btn-primary btn-sm" onClick={() => handleDeliver(o._id)}>
                            Deliver
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;