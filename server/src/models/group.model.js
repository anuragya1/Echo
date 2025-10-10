import mongoose from 'mongoose';
import { v1 } from 'uuid';

const groupSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => v1(),
    unique: true,
  },
  participants: {
    type: [String],
    default: [],
  },
  admins: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: false,
  },
  messages: {
    type: [String],
    default: [],
  },
  name: {
    type: String,
    required: false,
    maxlength: 50,
  },
  image: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

export const Group = mongoose.model('Group', groupSchema);