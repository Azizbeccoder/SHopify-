import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQty, totalPrice, clearCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const shipping = totalPrice > 50 ? 0 : 9.99;
  const tax = +(totalPrice * 0.1).toFixed(2);
  const grandTotal = +(totalPrice + shipping + tax).toFixed(2);

  const handleCheckout = () => {
    if (!userInfo) navigate('/login?redirect=checkout');
    else navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <div className="container text-center">
          <div className="empty-cart">
            <p className="empty-cart-icon">🛒</p>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/products" className="btn btn-primary mt-3">Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button className="btn btn-secondary btn-sm" onClick={clearCart}>Clear Cart</button>
        </div>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <Link to={`/products/${item._id}`} className="cart-item-name">{item.name}</Link>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-controls">
                  <select
                    value={item.qty}
                    onChange={(e) => updateQty(item._id, Number(e.target.value))}
                  >
                    {[...Array(Math.min(item.stock, 10)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                  <span className="cart-item-subtotal">${(item.price * item.qty).toFixed(2)}</span>
                  <button className="remove-btn" onClick={() => removeFromCart(item._id)}>✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="badge badge-success">FREE</span> : `$${shipping}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span><span>${tax}</span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-row summary-total">
              <span>Total</span><span>${grandTotal}</span>
            </div>
            <button className="btn btn-primary btn-block mt-3" onClick={handleCheckout}>
              Proceed to Checkout →
            </button>
            <Link to="/products" className="btn btn-secondary btn-block mt-2 text-center">
              Continue Shopping
            </Link>
            {totalPrice < 50 && (
              <p className="free-shipping-hint">
                Add ${(50 - totalPrice).toFixed(2)} more for free shipping!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
