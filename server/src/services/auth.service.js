import User from '../models/user.model.js';

import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const authService = {
  validateUser: async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw createError(404, 'User not found');

    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  },

  login: async (user) => {
    const payload = {
      id: user.id,
      username: user.username,
      image: user.image,
    };
    
    return {
      statusCode: '200',
      access_token: jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpire }),
    };
  },

  register: async (userDoc) => {
    const existingUser = await User.findOne({ email: userDoc.email });
    if (existingUser) throw createError(409, 'User already exists');

    const newUser = new User({
      username: userDoc.username,
      email: userDoc.email,
      password: userDoc.password,
      image: userDoc.image,
    });
    await newUser.save();

    return {
      statusCode: '201',
      message: 'User created successfully',
    };
  },
};

export default authService;