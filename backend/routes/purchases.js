const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { protect, restrictTo } = require('../middlewares/auth');

// All routes require authentication
router.use(protect);

// Purchase routes for farmers (role 1)
router.post('/courses/:courseId', restrictTo(1), purchaseController.initiatePurchase);
router.post('/confirm/:transactionId', restrictTo(1), purchaseController.confirmPurchase);
router.get('/my-courses', restrictTo(1), purchaseController.getUserPurchases);
router.post('/progress/:courseId', restrictTo(1), purchaseController.updateProgress);

module.exports = router;
