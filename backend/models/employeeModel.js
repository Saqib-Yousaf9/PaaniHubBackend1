const mongoose = require('mongoose');

// Define the USER schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Define the Profile schema
const profileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  city: { type: String },
  zipCode: { type: String },
  address: { type: String },
  phoneNumber: { type: String },
  licenceNo: { type: String },
  carNo: { type: String },
  gender: { type: String },
  picture: { type: String }
});

// Create models from schemas
const User = mongoose.model('User', userSchema);
const Profile = mongoose.model('Profile', profileSchema);

module.exports = { User, Profile };
