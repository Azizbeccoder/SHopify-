const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getProfile, updateProfile, getUsers } = require('../controllers/userController');

router.get('/', protect, admin, getUsers);
router.route('/profile').get(protect, getProfile).put(protect, updateProfile);

module.exports = router;
