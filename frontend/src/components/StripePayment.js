import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../utils/api';
import './StripePayment.css';

// Card element styling
const CARD_STYLE = {
  style: {
    base: {
      color: '#f0f0ff',
      fontFamily: 'DM Sans, sans-serif',
      fontSize: '16px',
      '::placeholder': { color: '#8888aa' },
      iconColor: '#6c63ff',
    },
    invalid: { color: '#ff3d71', iconColor: '#ff3d71' },
  },
};

const CheckoutForm = ({ orderId, amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [cardError, setCardError] = useState('');

  useEffect(() => {
    // Get payment intent from backend
    api.post('/payment/create-payment-intent', { orderId })
      .then(res => setClientSecret(res.data.clientSecret))
      .catch(err => onError(err.response?.data?.message || 'Failed to initialize payment'));
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setCardError('');

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      setCardError(error.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        await api.put(`/payment/confirm/${orderId}`, {
          paymentIntentId: paymentIntent.id,
        });
        onSuccess();
      } catch (err) {
        onError('Payment confirmed but order update failed. Contact support.');
      }
    }
    setLoading(false);
  };

  return (
    <form className="stripe-form" onSubmit={handleSubmit}>
      <div className="stripe-card-wrap">
        <label>Card Details</label>
        <div className="stripe-card-element">
          <CardElement options={CARD_STYLE} onChange={(e) => setCardError(e.error?.message || '')} />
        </div>
        {cardError && <p className="stripe-error">{cardError}</p>}
      </div>

      <div className="stripe-test-cards">
        <p>🧪 Test Cards:</p>
        <div className="test-card-grid">
          <div><code>4242 4242 4242 4242</code><span>✅ Success</span></div>
          <div><code>4000 0000 0000 0002</code><span>❌ Declined</span></div>
        </div>
        <p style={{ marginTop: 4 }}>Use any future expiry, any CVC, any ZIP</p>
      </div>

      <button
        className="stripe-pay-btn"
        type="submit"
        disabled={!stripe || loading || !clientSecret}
      >
        {loading ? (
          <span className="stripe-loading">
            <span className="stripe-spinner" />
            Processing...
          </span>
        ) : (
          `💳 Pay $${amount?.toFixed(2)}`
        )}
      </button>

      <div className="stripe-secure-badge">
        <span>🔒</span>
        <span>Secured by Stripe — 256-bit SSL encryption</span>
      </div>
    </form>
  );
};

const StripePayment = ({ orderId, amount, onSuccess, onError }) => {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    api.get('/payment/config').then(res => {
      setStripePromise(loadStripe(res.data.publishableKey));
    });
  }, []);

  if (!stripePromise) {
    return (
      <div className="stripe-loading-wrap">
        <div className="loader" />
        <p>Loading payment...</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        orderId={orderId}
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripePayment;