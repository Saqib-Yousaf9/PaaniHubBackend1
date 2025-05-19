const express = require('express');
const router = express.Router();
const { User, Profile } = require('../models/employeeModel');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// Route to register a new user
router.post('/register', upload.single('picture'), async (req, res) => {
  const { email, password, firstName, lastName, city, zipCode, address, phoneNumber, licenceNo, carNo, gender } = req.body;
  const picture = req.file ? req.file.path : null;  // Get the path of the uploaded file

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashedPassword });
    await user.save();

    const profile = new Profile({
      user_id: user._id,
      firstName,
      lastName,
      city,
      zipCode,
      address,
      phoneNumber,
      licenceNo,
      carNo,
      gender,
      picture
    });
    await profile.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Set the session
    req.session.userId = user._id;
    res.json({ message: 'Logged in successfully' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to check session status
router.get('/protected', isAuthenticated, (req, res) => {
  
  res.status(200).json({ message: 'Protected route accessed' });
});

// Route to logout a user
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
