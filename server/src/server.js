import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import { connectDB } from './config/db.js';
import { jwtAuthMiddleware } from './middlewares/auth.middleware.js';

import userRoutes from './routes/user.route.js';
import messageRoutes from './routes/message.route.js';
import groupRoutes from './routes/group.route.js';
import authRoutes from './routes/auth.route.js';
import { setupSocket } from './socket/index.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",       
      "https://your-ngrok-id.ngrok-free.app"
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

connectDB();

app.use(cors({ 
  origin: '*', 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/channels', groupRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/profile', jwtAuthMiddleware, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


setupSocket(io);

const PORT = 5000;
server.listen(PORT, () => {

  console.log(`   Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
});

export { app, server, io };