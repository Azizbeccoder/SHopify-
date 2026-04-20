const Order = require('../models/Order');

let stripe;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
} catch (err) {
  console.log('Stripe not initialized');
}

let nodemailer;
try { nodemailer = require('nodemailer'); } catch (e) {}

const sendConfirmationEmail = async (order, userEmail, userName) => {
  try {
    if (!nodemailer || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const itemsList = order.orderItems
      .map(i => `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${(i.price * i.qty).toFixed(2)}</td>
      </tr>`).join('');

    await transporter.sendMail({
      from: `"ShopZone" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `✅ Order Confirmed — #${order._id.toString().slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:20px">
          <div style="background:#6c63ff;padding:30px;text-align:center;border-radius:8px 8px 0 0">
            <h1 style="color:#fff;margin:0">⚡ ShopZone</h1>
            <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">Your order is confirmed!</p>
          </div>
          <div style="background:#fff;padding:30px;border-radius:0 0 8px 8px">
            <h2 style="color:#333;margin-top:0">Hi ${userName}! 👋</h2>
            <p style="color:#666">Thank you for your order. We're preparing it now!</p>
            <div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:20px 0">
              <p style="margin:0;color:#333"><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
              <p style="margin:6px 0 0;color:#333"><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
            </div>
            <h3 style="color:#333">Items Ordered</h3>
            <table style="width:100%;border-collapse:collapse">
              <thead>
                <tr style="background:#f5f5f5">
                  <th style="padding:10px 8px;text-align:left">Product</th>
                  <th style="padding:10px 8px;text-align:center">Qty</th>
                  <th style="padding:10px 8px;text-align:right">Price</th>
                </tr>
              </thead>
              <tbody>${itemsList}</tbody>
            </table>
            <div style="border-top:2px solid #6c63ff;margin-top:16px;padding-top:16px;text-align:right">
              <strong style="font-size:18px;color:#6c63ff">Total: $${order.totalPrice.toFixed(2)}</strong>
            </div>
            <div style="background:#e8f4fd;padding:16px;border-radius:8px;margin-top:20px">
              <h4 style="margin:0 0 8px;color:#333">📦 Shipping To:</h4>
              <p style="margin:0;color:#666">
                ${order.shippingAddress.address}, ${order.shippingAddress.city}<br>
                ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}
              </p>
            </div>
            <p style="text-align:center;color:#6c63ff;font-weight:bold;margin-top:24px">Thank you for shopping with ShopZone! 🛍</p>
          </div>
        </div>
      `,
    });
    console.log('✅ Email sent to', userEmail);
  } catch (err) {
    console.error('❌ Email error:', err.message);
  }
};

// @desc  Get Stripe publishable key
// @route GET /api/payment/config
const getStripeConfig = async (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  });
};

// @desc  Create payment intent
// @route POST /api/payment/create-payment-intent
const createPaymentIntent = async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ message: 'Stripe not configured' });

    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.isPaid) return res.status(400).json({ message: 'Order already paid' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100),
      currency: 'usd',
      metadata: {
        orderId: orderId.toString(),
        userId: req.user._id.toString(),
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret, amount: order.totalPrice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Confirm payment
// @route PUT /api/payment/confirm/:orderId
const confirmPayment = async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ message: 'Stripe not configured' });

    const { paymentIntentId } = req.body;
    const order = await Order.findById(req.params.orderId).populate('user', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentMethod = 'Stripe';
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      updateTime: new Date().toISOString(),
      emailAddress: order.user.email,
    };

    await order.save();
    await sendConfirmationEmail(order, order.user.email, order.user.name);

    res.json({ message: 'Payment confirmed', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createPaymentIntent, confirmPayment, getStripeConfig };