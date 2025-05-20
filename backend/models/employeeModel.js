const mongoose = require('mongoose');

// Define the USER schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },          
  verificationCode: { type: String },
  resetCode: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
// Define the Profile schema
const profileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  city: { type: String , required: false},
  zipCode: { type: String,required: false },
  address: { type: String,required: false },
  phoneNumber: { type: String,required: false },
  licenceNo: { type: String ,required: false},
  carNo: { type: String,required: false },
  gender: { type: String,required: false },
  picture: { type: String ,required: false},
  role: { 
    type: String, 
    enum: ['user', 'driver'],  // Enum to limit the role to either 'user' or 'driver'
    required: false 
  }
});

// Create models from schemas
const User = mongoose.model('User', userSchema);
const Profile = mongoose.model('Profile', profileSchema);

module.exports = { User, Profile };
