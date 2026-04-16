import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then((res) => { setOrders(res.data); setLoading(false); });
  }, []);

  const total = orders.reduce((acc, o) => acc + o.totalPrice, 0);

  return (
    <div className="page">
      <div className="container">
        <div className="admin-header">
          <h1>Orders Management</h1>
          <div className="admin-stat">
            <span>Total Revenue:</span>
            <strong style={{ color: 'var(--success)' }}>${total.toFixed(2)}</strong>
          </div>
        </div>

        {loading ? (
          <div className="loader-wrap"><div className="loader" /></div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--gray)' }}>#{o._id.slice(-8)}</td>
                    <td>{o.user?.name || 'N/A'}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 700 }}>${o.totalPrice.toFixed(2)}</td>
                    <td>{o.isPaid ? <span className="badge badge-success">✓ Paid</span> : <span className="badge badge-danger">No</span>}</td>
                    <td>{o.isDelivered ? <span className="badge badge-success">✓ Done</span> : <span className="badge badge-warning">Pending</span>}</td>
                    <td><Link to={`/orders/${o._id}`} className="btn btn-secondary btn-sm">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
