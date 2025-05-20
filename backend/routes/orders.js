const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');

// Get all orders (for frontend refresh)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('customerId', 'firstName lastName'); // <-- Add this
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}); 

router.post('/cancel/:id', async (req, res) => {
  const customerId = req.query.customerId;
  const driverId = req.query.driverId;
  const orderId = req.params.id;

  console.log('Cancel request:', { orderId, customerId, driverId });

  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required' });
  }
  if (!customerId && !driverId) {
    return res.status(400).json({ message: 'customerId or driverId is required' });
  }

  try {
    // Build $or array to match both ObjectId and string types
    const orArr = [];
    if (customerId) {
      orArr.push({ customerId: customerId });
      // Also try as ObjectId if valid
      if (mongoose.Types.ObjectId.isValid(customerId)) {
        orArr.push({ customerId: new mongoose.Types.ObjectId(customerId) });
      }
    }
    if (driverId) {
      orArr.push({ driverId: driverId });
      if (mongoose.Types.ObjectId.isValid(driverId)) {
        orArr.push({ driverId: new mongoose.Types.ObjectId(driverId) });
      }
    }

   const query = {
  _id: mongoose.Types.ObjectId.isValid(orderId) ? new mongoose.Types.ObjectId(orderId) : orderId,
  status: { $in: ['pending', 'inprogress'] },
  $or: orArr
};

    console.log('Cancel query:', query);

    const order = await Order.findOneAndUpdate(
      query,
      { status: 'cancelled' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found or not authorized to cancel' });
    }
    res.json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/delete-all', async (req, res) => {
  try {
    await Order.deleteMany({});
    res.json({ message: 'All orders deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
router.get('/pending', async (req, res) => {
  try {
const orders = await Order.find({ status: 'pending' })
  .populate('customerId', 'firstName lastName')
  .populate('driverId', 'name');
    const mapped = orders.map(order => ({
      orderId: order._id,
      
    customerId: order.customerId?._id?.toString() || order.customerId?.toString() || null,
customerName: order.customerId?.firstName
  ? `${order.customerId.firstName} ${order.customerId.lastName}`
  : 'Unknown',
      driverId: order.driverId?._id || order.driverId, // Include driverId
      driverName: order.driverId?.name || undefined,    // Optional: include driver name
      to: order.to,
      bidAmount: order.bid,
      status: order.status,
    }));
 console.log('Raw orders:', orders.customerName);
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
const mongoose = require('mongoose');
router.delete('/pending/:id', async (req, res) => {
  const customerId = req.query.customerId;
  const driverId = req.query.driverId;
  const orderId = req.params.id;

  console.log('Delete request:', { orderId, customerId, driverId });

  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required' });
  }
  if (!customerId && !driverId) {
    return res.status(400).json({ message: 'customerId or driverId is required' });
  }

  try {
    const query = {
      _id: orderId,
      status: 'pending',
      $or: []
    };
    if (customerId) query.$or.push({ customerId: new mongoose.Types.ObjectId(customerId) });
    if (driverId) query.$or.push({ driverId: new mongoose.Types.ObjectId(driverId) });

    console.log('Delete query:', query);

    const order = await Order.findOneAndDelete(query);

    if (!order) {
      return res.status(404).json({ message: 'Pending order not found or not authorized' });
    }
    res.json({ message: 'Pending order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/running/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const runningOrder = await Order.findOne({
  customerId: new mongoose.Types.ObjectId(customerId),
  status: { $in: ['pending', 'inprogress'] }
})
  .sort({ createdAt: -1 })
  .populate('customerId');
    console.log("Running order:", runningOrder);
    res.json(runningOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
router.post('/complete/:id', async (req, res) => {
  const customerId = req.query.customerId;
  const driverId = req.query.driverId;
  const orderId = req.params.id;

  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required' });
  }
  if (!customerId && !driverId) {
    return res.status(400).json({ message: 'customerId or driverId is required' });
  }

  try {
    const orArr = [];
    if (customerId) {
      orArr.push({ customerId: customerId });
      if (mongoose.Types.ObjectId.isValid(customerId)) {
        orArr.push({ customerId: new mongoose.Types.ObjectId(customerId) });
      }
    }
    if (driverId) {
      orArr.push({ driverId: driverId });
      if (mongoose.Types.ObjectId.isValid(driverId)) {
        orArr.push({ driverId: new mongoose.Types.ObjectId(driverId) });
      }
    }

    const query = {
      _id: mongoose.Types.ObjectId.isValid(orderId) ? new mongoose.Types.ObjectId(orderId) : orderId,
      status: { $in: ['pending', 'inprogress'] },
      $or: orArr
    };

    const order = await Order.findOneAndUpdate(
      query,
      { status: 'completed' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found or not authorized to complete' });
    }
    res.json({ message: 'Order marked as completed successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
module.exports = router;