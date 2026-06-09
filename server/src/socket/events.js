import { Group } from "../models/group.model.js";
import { addMessage } from "../services/message.service.js";

const isGroupMember = async (groupId, userId) => {
  const group = await Group.findOne({ id: groupId, participants: userId }).select('id');
  return Boolean(group);
};

export const setupSocketEvents = (io) => {
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    const username = socket.user.username;
    const sockets = onlineUsers.get(userId) || new Set();
    const wasOffline = sockets.size === 0;

    sockets.add(socket.id);
    onlineUsers.set(userId, sockets);

    if (wasOffline) {
      socket.broadcast.emit('user-status-change', {
        userId,
        status: 'online'
      });
    }

    socket.on('user-online', () => {
      socket.emit('user-status-change', {
        userId,
        status: 'online'
      });
    });

    socket.on('check-user-status', async (data) => {
      if (data.channelId && !(await isGroupMember(data.channelId, userId))) {
        socket.emit('error', { message: 'You are not allowed to check this room' });
        return;
      }

      if (data.channelId && !(await isGroupMember(data.channelId, data.userId))) {
        socket.emit('user-status-response', {
          userId: data.userId,
          status: 'offline'
        });
        return;
      }

      socket.emit('user-status-response', {
        userId: data.userId,
        status: onlineUsers.has(data.userId) ? 'online' : 'offline'
      });
    });

    socket.on('chat', async (message, acknowledge) => {
      const reply = (payload) => {
        if (typeof acknowledge === 'function') {
          acknowledge(payload);
        }
      };

      try {
        const groupId = message.groupId || message.channelId;
        if (!groupId) {
          socket.emit('error', { message: 'GroupId is required' });
          reply({ ok: false, message: 'GroupId is required' });
          return;
        }

        if (!(await isGroupMember(groupId, userId))) {
          socket.emit('error', { message: 'You are not allowed to message this room' });
          reply({ ok: false, message: 'You are not allowed to message this room' });
          return;
        }

        const result = await addMessage({
          text: message.text,
          images: message.images || [],
          channelId: groupId,
          userId
        });

        if (result.statusCode !== '201') {
          socket.emit('error', { message: result.message || 'Failed to save message' });
          reply({ ok: false, message: result.message || 'Failed to save message' });
          return;
        }

        const broadcastMessage = {
          ...message,
          id: result.data?.id,
          userId,
          user: { username },
          createdAt: result.data?.createdAt || new Date(),
          groupId,
          channelId: groupId
        };

        io.to(groupId).emit('chat', broadcastMessage);
        reply({ ok: true, message: broadcastMessage });
      } catch (error) {
        socket.emit('error', {
          message: 'Failed to save message',
          error: error.message
        });
        reply({ ok: false, message: 'Failed to save message' });
      }
    });

    socket.on('join-group', async (groupId) => {
      if (!(await isGroupMember(groupId, userId))) {
        socket.emit('error', { message: 'You are not allowed to join this room' });
        return;
      }

      socket.join(groupId);
      socket.emit('joined-group', { groupId });
    });

    socket.on('leave-group', (groupId) => {
      socket.leave(groupId);
      socket.emit('left-group', { groupId });
    });

    socket.on('typing', async (data) => {
      if (!(await isGroupMember(data.groupId, userId))) return;

      socket.to(data.groupId).emit('user-typing', {
        userId,
        username,
        groupId: data.groupId
      });
    });

    socket.on('stop-typing', async (data) => {
      if (!(await isGroupMember(data.groupId, userId))) return;

      socket.to(data.groupId).emit('user-stop-typing', {
        userId,
        groupId: data.groupId
      });
    });

    socket.on('disconnect', () => {
      const sockets = onlineUsers.get(userId);
      if (!sockets) return;

      sockets.delete(socket.id);

      if (sockets.size === 0) {
        onlineUsers.delete(userId);
        socket.broadcast.emit('user-status-change', {
          userId,
          status: 'offline'
        });
      }
    });
  });
};
