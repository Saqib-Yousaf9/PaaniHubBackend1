const express = require('express');
  const mongoose = require('mongoose');
  require('dotenv').config();
  const session = require('express-session');
  const nodemailer = require('nodemailer');
  const MongoStore = require('connect-mongo');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const employeeRoutes = require('./routes/employee');
  const orderRoutes = require('./routes/orderRoutes');
  const dotenv = require('dotenv');
  const http = require('http'); // Import http for the server
  const { Server } = require('socket.io'); // Import Socket.IO
  const Order = require('./models/orderModel');
  // Load environment variables
  const ordersRouter = require('./routes/orders');

  

  const app = express();
  const server = http.createServer(app);
  // Create an HTTP server
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Frontend URL
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Project')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

  // Configure CORS
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

  // Middleware to parse incoming request bodies
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || '123',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'false',
      httpOnly: true,
      sameSite: true
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/Project'
    })
  }));

  // // Use employee routes
  app.use('/api/employee', employeeRoutes);

  app.use('/api/order', orderRoutes);

  // Socket.IO connection
  io.on('connection', (socket) => {
   

    // Listening for events from the client (e.g., customer placing a request)
    socket.on('newRequest', async (data) => {


      const { bidAmount, customerId, toLocation,customerName } = data; // Updated to use 
   
      // Validate incoming request data
      if (!bidAmount || !customerId || !toLocation||!customerName) {
        return socket.emit('errorMessage', { message: 'Missing required fields' });
      }

      try {
      if (!mongoose.Types.ObjectId.isValid(customerId)) {
  console.error('Invalid customerId:', customerId);
  return socket.emit('errorMessage', { message: 'Invalid customerId' });
}
        const newOrder = new Order({
          bid: bidAmount,
          customerId: new mongoose.Types.ObjectId(customerId),
          to:toLocation, // Store 'toLocation' provided by the 
          status: 'pending', // Set status as "pending"
        });

       console.log('Creating order with customerId:', customerId, 'Type:', typeof customerId);
   await newOrder.save();
console.log('Saved order:', newOrder);
        // Broadcast the new request to all drivers (notify that there's a new request)
   io.emit('newRequestBroadcast', {
  orderId: newOrder._id,
  customerName,
  customerId: newOrder.customerId,
  toLocation: newOrder.to, 
  bidAmount: newOrder.bid,
  status: newOrder.status,
  createdAt: newOrder.createdAt,
  updatedAt: newOrder.updatedAt,
});
       

      } catch (error) {
        console.error('Error saving order:', error);
        socket.emit('errorMessage', { message: 'Failed to save order' });
      }
    });

  
        socket.on('acceptRequest', async (data) => {
        const { orderId, driverId, fromLocation } = data;
      
        try {
          // Check if all necessary data is provided
          if (!orderId || !driverId || !fromLocation) {
            return socket.emit('errorMessage', { message: 'Missing required fields' });
          }
      
          const order = await Order.findById(orderId);
      
          // Check if order exists
          if (!order) {
            return socket.emit('errorMessage', { message: 'Order not found' });
          }
      
          // Check if the order is still available for accepting
          if (order.status !== 'pending') {
            return socket.emit('errorMessage', { message: 'Order is no longer available' });
          }
      
          // Update order status and assign driver
          order.status = 'inprogress';
          order.driverId = driverId;
         order.from = fromLocation;
      
          // Save the order
          const updatedOrder = await order.save();
          
          if (!updatedOrder) {
            return socket.emit('errorMessage', { message: 'Failed to save order changes' });
          }
      
          // Emit the order status update
          io.emit('orderStatusUpdate', {
            orderId: updatedOrder._id,
            status: updatedOrder.status,
            driverId: updatedOrder.driverId,
            fromLocation: updatedOrder.from,
          });
      
          console.log('Order accepted successfully:', updatedOrder);
        } catch (error) {
          console.error('Error accepting order:', error);
          socket.emit('errorMessage', { message: 'Failed to accept order' });
        }
      });
      
    // Handle disconnect events
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });







app.post('/api/support/email', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ message: "All fields required" });

  // Configure your email transport
  const transporter = nodemailer.createTransport({
         host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: 'saqiyousaf813@gmail.com', // 
      subject: `Driver Support Request from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    res.json({ message: "Email sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send email", error: err.message });
  }
});



app.use('/api/requests', ordersRouter);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong' });
  });


  // Start the server
  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
