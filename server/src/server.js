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

// Import services for socket
import { addMessage } from './services/message.service.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // Handle chat messages
  socket.on('chat', async (message) => {
    try {
      console.log('💬 Message received:', message);
      
      // FIXED: Handle both field name formats
      const groupId = message.groupId || message.channelId || message.GroupId;
      
      if (!groupId) {
        console.error('❌ No group ID provided');
        socket.emit('error', { message: 'Group ID is required' });
        return;
      }

      // Save message using existing service
      const result = await addMessage({
        text: message.text,
        images: message.images || [],
        channelId: groupId,
        userId: message.userId
      });

      // FIXED: Broadcast to room AND emit back to sender
      if (result.statusCode === '201') {
        const broadcastMessage = {
          ...message,
          id: result.data?.id,
          createdAt: result.data?.createdAt || new Date(),
          GroupId: groupId,
          groupId: groupId,
          channelId: groupId
        };

        // Broadcast to all clients in the room (including sender)
        io.to(groupId).emit('chat', broadcastMessage);
        console.log(`✅ Message broadcasted to room: ${groupId}`);
      } else {
        console.error('❌ Failed to save message:', result);
        socket.emit('error', { message: 'Failed to save message' });
      }
    } catch (error) {
      console.error('❌ Error handling chat:', error);
      socket.emit('error', { message: 'Failed to send message', error: error.message });
    }
  });

  // Join group
  socket.on('join-group', (groupId) => {
    socket.join(groupId);
    console.log(`✅ Socket ${socket.id} joined group ${groupId}`);
    socket.emit('joined-group', { groupId });
  });

  // Leave group
  socket.on('leave-group', (groupId) => {
    socket.leave(groupId);
    console.log(`👋 Socket ${socket.id} left group ${groupId}`);
    socket.emit('left-group', { groupId });
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(data.groupId).emit('user-typing', {
      userId: data.userId,
      username: data.username,
      groupId: data.groupId
    });
  });

  // Stop typing
  socket.on('stop-typing', (data) => {
    socket.to(data.groupId).emit('user-stop-typing', {
      userId: data.userId,
      groupId: data.groupId
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

connectDB();

app.use(cors({ 
  origin:'*', 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/channels', groupRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Profile route
app.get('/api/profile', jwtAuthMiddleware, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log('');
  console.log('🚀 ====================================');
  console.log(`   Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('   💬 WebSocket server ready');
  console.log('🚀 ====================================');
  console.log('');
});

export { app, server, io };