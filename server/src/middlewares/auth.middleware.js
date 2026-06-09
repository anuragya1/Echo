import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import authService from '../services/auth.service.js';

export const jwtAuthMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const socketAuthMiddleware = (socket, next) => {
  try {
    const authToken = socket.handshake.auth?.token;
    const headerToken = socket.handshake.headers?.authorization?.replace('Bearer ', '');
    const token = authToken || headerToken;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    socket.user = jwt.verify(token, config.jwtSecret);
    return next();
  } catch (error) {
    return next(new Error('Invalid token'));
  }
};

export const requireSelfParam = (paramName = 'id') => (req, res, next) => {
  if (req.user?.id !== req.params[paramName]) {
    return res.status(403).json({ message: 'You are not allowed to access this resource' });
  }

  return next();
};

export const localAuthMiddleware = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    
    const user = await authService.validateUser(email, password);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};
