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

groupSchema.index({ participants: 1 });
groupSchema.index({ admins: 1 });

export const Group = mongoose.model('Group', groupSchema);
