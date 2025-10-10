import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 } from 'uuid'; // Note: You originally used v4 here, not v1

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => v4(),
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    default: 'https://res.cloudinary.com/dtzs4c2uv/image/upload/v1666326774/noavatar_rxbrbk.png',
  },
  friends: {
    type: [String],
    default: [],
  },
  blocked: {
    type: [String],
    default: [],
  },
  requests: {
    type: [String],
    default: [],
  },
}, {
  timestamps: false,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;