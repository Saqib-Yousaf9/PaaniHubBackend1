const mongoose = require('mongoose');

// Define the Order schema
const orderSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Profile', 
    required: true 
  },
  driverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Profile',
    required: false 
  }, // Reference to the Profile model
  from: { 
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: false }
    },

  }, // Location as { lat, lng, address }
  to: { 
   lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: false }
  }, // Destination
  bid: { 
    type: Number, 
    required: true 
  }, // Bid amount
  status: { 
    type: String, 
    enum: ['pending', 'cancelled', 'inprogress', 'completed'], 
    default: 'pending',
    required: true 
  }, // Status of the order
  createdAt: { 
    type: Date, 
    default: Date.now 
  }, // Order creation date
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }, // Order update date
});

// Pre-save hook to update the `updatedAt` field
orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Order model from the schema
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;