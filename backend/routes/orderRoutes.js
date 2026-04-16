const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createOrder, getOrderById, getMyOrders, getAllOrders, payOrder, deliverOrder
} = require('../controllers/orderController');

router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders);
router.get('/myorders', protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.put('/:id/pay', protect, payOrder);
router.put('/:id/deliver', protect, admin, deliverOrder);

module.exports = router;
