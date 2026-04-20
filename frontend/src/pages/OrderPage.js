import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StripePayment from '../components/StripePayment';
import './OrderPage.css';

const OrderTimeline = ({ order }) => {
  const steps = [
    { label: 'Order Placed', icon: '📋', desc: 'Order received', done: true, date: order.createdAt },
    { label: 'Payment', icon: '💳', desc: order.isPaid ? 'Payment confirmed' : 'Awaiting payment', done: order.isPaid, date: order.paidAt },
    { label: 'Processing', icon: '📦', desc: order.isPaid ? 'Preparing your order' : 'Pending payment', done: order.isPaid },
    { label: 'Delivered', icon: '🚚', desc: order.isDelivered ? 'Delivered!' : 'On its way', done: order.isDelivered, date: order.deliveredAt },
  ];
  const activeStep = steps.filter(s => s.done).length - 1;

  return (
    <div className="order-timeline">
      <h3>Order Status</h3>
      <div className="timeline-track">
        <div className="timeline-progress-line" style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }} />
        {steps.map((step, i) => (
          <div key={i} className={`timeline-step ${step.done ? 'done' : ''} ${i === activeStep ? 'active' : ''}`}>
            <div className="timeline-icon">{step.icon}</div>
            <div className="timeline-label">{step.label}</div>
            <div className="timeline-desc">{step.desc}</div>
            {step.date && (
              <div className="timeline-date">
                {new Date(step.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paySuccess, setPaySuccess] = useState(false);
  const [payError, setPayError] = useState('');
  const [showStripe, setShowStripe] = useState(false);

  const fetchOrder = () => {
    api.get(`/orders/${id}`).then((res) => {
      setOrder(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const handlePaySuccess = () => {
    setPaySuccess(true);
    setShowStripe(false);
    fetchOrder();
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
              {order.isPaid ? '✓ Paid' : 'Not Paid'}
            </span>
            <span className={`badge ${order.isDelivered ? 'badge-success' : 'badge-warning'}`}>
              {order.isDelivered ? '✓ Delivered' : 'Pending Delivery'}
            </span>
          </div>
        </div>

        {/* Payment Success Banner */}
        {paySuccess && (
          <div className="alert alert-success" style={{ fontSize: '1rem', padding: '18px 24px' }}>
            🎉 <strong>Payment Successful!</strong> A confirmation email has been sent to your inbox.
          </div>
        )}

        {/* Timeline */}
        <OrderTimeline order={order} />

        <div className="order-layout">
          <div>
            {/* Shipping */}
            <div className="card mb-3">
              <h3>📦 Shipping Address</h3>
              <p><strong>Name:</strong> {order.user?.name}</p>
              <p><strong>Email:</strong> {order.user?.email}</p>
              <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            </div>

            {/* Payment */}
            <div className="card mb-3">
              <h3>💳 Payment</h3>
              <p><strong>Method:</strong> {order.paymentMethod || 'Stripe'}</p>
              {order.isPaid && (
                <p><strong>Paid on:</strong> {new Date(order.paidAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              )}
              {order.paymentResult?.id && (
                <p style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--gray)' }}>
                  Transaction: {order.paymentResult.id}
                </p>
              )}
            </div>

            {/* Items */}
            <div className="card">
              <h3>🛒 Order Items</h3>
              {order.orderItems.map((item, i) => (
                <div key={i} className="order-item-row">
                  <img src={item.image} alt={item.name} />
                  <span className="order-item-name">{item.name}</span>
                  <span className="order-item-price">
                    {item.qty} × ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary + Payment */}
          <div>
            <div className="card order-summary">
              <h3>Summary</h3>
              <div className="summary-row"><span>Items</span><span>${order.itemsPrice.toFixed(2)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice}`}</span></div>
              <div className="summary-row"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
              <div className="summary-row" style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--light)' }}>
                <span>Total</span><span>${order.totalPrice.toFixed(2)}</span>
              </div>

              {/* Pay with Stripe */}
              {!order.isPaid && (
                <div className="payment-section">
                  {!showStripe ? (
                    <button
                      className="btn btn-primary btn-block mt-3"
                      onClick={() => setShowStripe(true)}
                    >
                      💳 Pay with Card
                    </button>
                  ) : (
                    <div className="stripe-wrap">
                      <div className="stripe-header">
                        <h4>💳 Enter Card Details</h4>
                        <button className="close-stripe" onClick={() => setShowStripe(false)}>✕</button>
                      </div>
                      {payError && <div className="alert alert-danger">{payError}</div>}
                      <StripePayment
                        orderId={order._id}
                        amount={order.totalPrice}
                        onSuccess={handlePaySuccess}
                        onError={(msg) => setPayError(msg)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Admin deliver button */}
              {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                <button className="btn btn-primary btn-block mt-3" onClick={handleDeliver}>
                  📦 Mark as Delivered
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;