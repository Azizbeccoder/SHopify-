import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './OrderPage.css';

const OrderPage = () => {
  const { id } = useParams();
  const { userInfo } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);

  const fetchOrder = () => {
    api.get(`/orders/${id}`).then((res) => {
      setOrder(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const handlePay = async () => {
    setPayLoading(true);
    await api.put(`/orders/${id}/pay`);
    fetchOrder();
    setPayLoading(false);
  };

  const handleDeliver = async () => {
    await api.put(`/orders/${id}/deliver`);
    fetchOrder();
  };

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>;
  if (!order) return <div className="page container"><p>Order not found.</p></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="order-header">
          <div>
            <h1>Order Details</h1>
            <p className="order-id">#{order._id}</p>
          </div>
          <div className="order-status-badges">
            <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-danger'}`}>
              {order.isPaid ? `✓ Paid ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
            </span>
            <span className={`badge ${order.isDelivered ? 'badge-success' : 'badge-warning'}`}>
              {order.isDelivered ? `✓ Delivered` : 'Pending Delivery'}
            </span>
          </div>
        </div>

        <div className="order-layout">
          <div>
            {/* Shipping */}
            <div className="card mb-3">
              <h3>📦 Shipping</h3>
              <p><strong>Name:</strong> {order.user?.name}</p>
              <p><strong>Email:</strong> {order.user?.email}</p>
              <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            </div>

            {/* Payment */}
            <div className="card mb-3">
              <h3>💳 Payment</h3>
              <p><strong>Method:</strong> {order.paymentMethod}</p>
            </div>

            {/* Items */}
            <div className="card">
              <h3>🛒 Order Items</h3>
              {order.orderItems.map((item, i) => (
                <div key={i} className="order-item-row">
                  <img src={item.image} alt={item.name} />
                  <span className="order-item-name">{item.name}</span>
                  <span className="order-item-price">{item.qty} × ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="card order-summary">
            <h3>Summary</h3>
            <div className="summary-row"><span>Items</span><span>${order.itemsPrice.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice}`}</span></div>
            <div className="summary-row"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
            <div className="summary-row" style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--light)' }}>
              <span>Total</span><span>${order.totalPrice.toFixed(2)}</span>
            </div>

            {!order.isPaid && (
              <button className="btn btn-primary btn-block mt-3" onClick={handlePay} disabled={payLoading}>
                {payLoading ? 'Processing...' : '💳 Mark as Paid (Demo)'}
              </button>
            )}

            {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
              <button className="btn btn-primary btn-block mt-3" onClick={handleDeliver}>
                📦 Mark as Delivered
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
