const Order = require('../models/orderModel'); // Import the Order model

// Function to get order details by orderId
const getOrderById = async (req, res) => {
  const { orderId } = req.params; // Get orderId from the request params

  try {
    // Find the order by its ID and populate the customerId field to get profile details
    const order = await Order.findById(orderId).populate('customerId', 'firstName lastName city phoneNumber');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getOrderById };
