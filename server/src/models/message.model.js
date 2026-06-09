import mongoose from 'mongoose';
import { v1 } from 'uuid';

const messageSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => v1(),
    unique: true,
  },
  channelId: {
    type: String,
    required: true,
    ref: 'Groups',
  },
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  text: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

messageSchema.index({ channelId: 1, createdAt: -1 });
messageSchema.index({ userId: 1 });

export const Message = mongoose.model('Message', messageSchema);
