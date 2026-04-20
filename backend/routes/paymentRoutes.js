const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
  createPaymentIntent,
  confirmPayment,
  getStripeConfig,
} = require('../controllers/paymentController');

router.get('/config', getStripeConfig);
router.post('/create-payment-intent', protect, createPaymentIntent);
router.put('/confirm/:orderId', protect, confirmPayment);

module.exports = router;