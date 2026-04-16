import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [shipping, setShipping] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const shippingCost = totalPrice > 50 ? 0 : 9.99;
  const tax = +(totalPrice * 0.1).toFixed(2);
  const total = +(totalPrice + shippingCost + tax).toFixed(2);

  const handleShipping = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const orderItems = cartItems.map((i) => ({
        product: i._id,
        name: i.name,
        image: i.image,
        price: i.price,
        qty: i.qty,
      }));
      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress: shipping,
        paymentMethod,
        itemsPrice: totalPrice,
        shippingPrice: shippingCost,
        taxPrice: tax,
        totalPrice: total,
      });
      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error placing order');
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

        {/* Steps indicator */}
        <div className="steps">
          {['Shipping', 'Review & Pay'].map((s, i) => (
            <div key={s} className={`step ${step > i ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <span className="step-num">{step > i + 1 ? '✓' : i + 1}</span>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="card">
                <h3>Shipping Address</h3>
                <form onSubmit={handleShipping}>
                  <div className="form-group">
                    <label>Street Address</label>
                    <input value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} required placeholder="123 Main St" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} required placeholder="New York" />
                    </div>
                    <div className="form-group">
                      <label>Postal Code</label>
                      <input value={shipping.postalCode} onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })} required placeholder="10001" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} required placeholder="United States" />
                  </div>
                  <button className="btn btn-primary" type="submit">Continue →</button>
                </form>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div>
                <div className="card mb-3">
                  <div className="review-header-row">
                    <h3>Shipping Address</h3>
                    <button className="btn btn-secondary btn-sm" onClick={() => setStep(1)}>Edit</button>
                  </div>
                  <p className="review-address">
                    {shipping.address}, {shipping.city}, {shipping.postalCode}, {shipping.country}
                  </p>
                </div>

                <div className="card mb-3">
                  <h3>Payment Method</h3>
                  <div className="payment-options">
                    {['PayPal', 'Credit Card', 'Bank Transfer'].map((m) => (
                      <label key={m} className={`payment-option ${paymentMethod === m ? 'selected' : ''}`}>
                        <input type="radio" value={m} checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} />
                        {m}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h3>Order Items ({cartItems.length})</h3>
                  {cartItems.map((item) => (
                    <div key={item._id} className="order-item-row">
                      <img src={item.image} alt={item.name} />
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-price">{item.qty} × ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {error && <div className="alert alert-danger mt-2">{error}</div>}
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="card checkout-summary">
            <h3>Summary</h3>
            <div className="summary-row"><span>Items</span><span>${totalPrice.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span></div>
            <div className="summary-row"><span>Tax</span><span>${tax}</span></div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
            <div className="summary-row" style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--light)' }}>
              <span>Total</span><span>${total}</span>
            </div>
            {step === 2 && (
              <button className="btn btn-primary btn-block mt-3" onClick={handlePlaceOrder} disabled={loading}>
                {loading ? 'Placing Order...' : '✓ Place Order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
