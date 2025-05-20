const express = require('express');
const router = express.Router();
const { User, Profile } = require('../models/employeeModel'); // Adjust path if needed
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const multer = require('multer');
const path = require('path');
const haversine = require('haversine');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'debuscdfr',
  api_key: '725125578528212',
  api_secret: 'uXnQM9ts4zRE-QF91G1XDajL5gg',
});
const crypto = require('crypto');
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user-pictures', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage: storage });

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};
router.post('/register', async (req, res) => {
  console.log(req.body);
  const { email, password, firstName, lastName, city, zipCode, address, phoneNumber, licenceNo, carNo, gender, picture, role } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'Email, password, first name, and last name are required.' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    user = new User({
      email,
      password: hashedPassword,
      isVerified: false,
      verificationCode
    });
    await user.save();

    // Create profile immediately
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
      picture,
      role,
    });
    await profile.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: '"PaaniHub" <your_email@gmail.com>',
      to: email,
      subject: 'Verify your email',
      text: `Your verification code is: ${verificationCode}`,
    });

    res.status(201).json({ message: 'User registered, profile created, verification email sent.' });
  } catch (err) {
    console.error('Detailed Server error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Generate a reset code
    const resetCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    user.resetCode = resetCode;
    await user.save();

    // Send reset code via email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: '"PaaniHub" <your_email@gmail.com>',
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${resetCode}`,
    });

    res.json({ message: 'Password reset code sent to your email.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

 
router.put('/update-profile', isAuthenticated, upload.single('picture'), async (req, res) => {
  const userId = req.session.userId;
  const { firstName, lastName, city, zipCode, address, phoneNumber, licenceNo, carNo, gender, role } = req.body;
  const picture = req.file ? req.file.path : null; // New picture uploaded to Cloudinary

  try {
    const profile = await Profile.findOne({ user_id: userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.firstName = firstName || profile.firstName;
    profile.lastName = lastName || profile.lastName;
    profile.city = city || profile.city;
    profile.zipCode = zipCode || profile.zipCode;
    profile.address = address || profile.address;
    profile.phoneNumber = phoneNumber || profile.phoneNumber;
    profile.licenceNo = licenceNo || profile.licenceNo;
    profile.carNo = carNo || profile.carNo;
    profile.gender = gender || profile.gender;
    profile.picture = picture || profile.picture; // Update picture URL
    profile.role = role || profile.role;

    await profile.save();

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
console.log(user.isVerified);
    // Block login if not verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'verify your email',
        needVerification: true, // <-- Add this flag
        email: user.email       // <-- Optionally send 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

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

router.post('/verify-email', async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Already verified' });
    if (user.verificationCode !== code) return res.status(400).json({ message: 'Invalid code' });

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Route to get user profile
router.get('/user-profile', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const profile = await Profile.findOne({ user_id: userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userProfile = {
      profileId: profile._id,
      userId: userId,
      email: user.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      city: profile.city,
      zipCode: profile.zipCode,
      address: profile.address,
      phoneNumber: profile.phoneNumber,
      licenceNo: profile.licenceNo,
      carNo: profile.carNo,
      gender: profile.gender,
      picture: profile.picture, // Retrieve picture URL
      role: profile.role,
    };

    res.status(200).json(userProfile);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/reset-password', async (req, res) => {
  console.log("RESET PASSWORD BODY:", req.body);
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ message: 'Email, code, and new password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (!user.resetCode || user.resetCode !== code) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetCode = undefined; // Clear the reset code after use
    await user.save();
;
    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (err) {
  console.error('Reset password error:', err); 
  res.status(500).json({ message: 'Server error', error: err.message });
}
});
router.post('/verify-reset-code', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ message: 'Email and code are required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (!user.resetCode || user.resetCode !== code) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }


    await user.save();

    res.json({ message: 'Code verified. You can now reset your password.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
router.put('/update-role', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const { role } = req.body;

  try {
    const profile = await Profile.findOne({ user_id: userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.role = role; // Update role

    await profile.save();

    res.status(200).json({ message: 'Role updated successfully' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to calculate distance between user and driver
router.post('/check-distance', (req, res) => {
  const { userLocation, driverLocation } = req.body;

  if (!userLocation || !driverLocation) {
    return res.status(400).json({ message: 'User and Driver locations are required.' });
  }

  // Use haversine to calculate the distance
  const distance = haversine(userLocation, driverLocation);

  if (distance <= 1) {
    res.json({ message: 'The driver is within 1km of the user.', distance });
  } else if (distance <= 2) {
    res.json({ message: 'The driver is within 2km of the user.', distance });
  } else {
    res.json({ message: 'The driver is farther than 2km from the user.', distance });
  }
});


router.post("/orders", async (req, res) => {
  const { userId, location, bidAmount } = req.body;

  if (!userId || !location || !bidAmount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newOrder = new Order({
      userId,
      location,
      bidAmount,
      status: "pending", // Initially, the order is pending
    });

    await newOrder.save();
    return res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ message: "Failed to place order" });
  }
});



module.exports = router;