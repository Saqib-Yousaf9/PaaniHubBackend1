const express = require('express');
const { getOrderById } = require('../controllers/orderController');
const router = express.Router();

router.get('/:orderId', getOrderById);

module.exports = router;
