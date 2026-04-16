import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/myorders').then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>;

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ fontSize: '2rem', marginBottom: '32px' }}>My Orders</h1>

        {orders.length === 0 ? (
          <div className="card text-center" style={{ padding: '60px' }}>
            <p style={{ color: 'var(--gray)', fontSize: '1.1rem' }}>You haven't placed any orders yet.</p>
            <Link to="/products" className="btn btn-primary mt-3">Start Shopping</Link>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--gray)' }}>
                      #{order._id.slice(-8)}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 600 }}>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      {order.isPaid
                        ? <span className="badge badge-success">✓ Paid</span>
                        : <span className="badge badge-danger">Unpaid</span>}
                    </td>
                    <td>
                      {order.isDelivered
                        ? <span className="badge badge-success">✓ Delivered</span>
                        : <span className="badge badge-warning">Pending</span>}
                    </td>
                    <td>
                      <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm">
                        View
                      </Link>
                    </td>
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

export default MyOrdersPage;
