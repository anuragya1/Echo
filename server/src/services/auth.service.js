import User from '../models/user.model.js';

import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const createTokenPayload = (user) => ({
  id: user.id,
  username: user.username,
  image: user.image,
});

const signAccessToken = (user) =>
  jwt.sign(createTokenPayload(user), config.jwtSecret, { expiresIn: config.jwtExpire });

const signRefreshToken = (user) =>
  jwt.sign({ id: user.id }, config.refreshJwtSecret, { expiresIn: config.refreshJwtExpire });

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
    return {
      statusCode: '200',
      access_token: signAccessToken(user),
      refresh_token: signRefreshToken(user),
    };
  },

  refresh: async (refreshToken) => {
    const decoded = jwt.verify(refreshToken, config.refreshJwtSecret);
    const user = await User.findOne({ id: decoded.id }).select('-password');

    if (!user) throw createError(401, 'Invalid refresh token');

    return {
      statusCode: '200',
      access_token: signAccessToken(user),
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
