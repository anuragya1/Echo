import { Group } from '../models/group.model.js';
import User from '../models/user.model.js';
import { Message } from '../models/message.model.js';

const getGroup = async (id, userId) => {
  try {
    const group = await Group.findOne({ id, participants: userId });
    
    if (!group) {
      return {
        statusCode: '404',
        message: 'Group not found.'
      };
    }

    // Populate participants
    const participants = await User.find({
      id: { $in: group.participants }
    }).select('-password');

    const channelData = group.toObject();
    channelData.participants = participants;

    return channelData;
  } catch (error) {
    return {
      statusCode: '404',
      message: 'Group not found.'
    };
  }
};

const getGroupsByUser = async (userId) => {
  try {
    const channels = await Group.find({
      participants: userId
    })
      .sort({ updatedAt: -1 })
      .select('-createdAt');

    const channelIds = channels.map((channel) => channel.id);
    const latestMessages = await Message.aggregate([
      { $match: { channelId: { $in: channelIds } } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$channelId', message: { $first: '$$ROOT' } } }
    ]);
    const latestByChannel = new Map(
      latestMessages.map((entry) => [entry._id, entry.message])
    );
    const lastMessages = channels.map((channel) => latestByChannel.get(channel.id) || null);

    return {
      lastMessages,
      channels
    };
  } catch (error) {
    return {
      statusCode: '404',
      message: 'User or group not found.'
    };
  }
};

const createGroup = async ({ participants, admins, image, name, description, userId }) => {
  try {
    const participantIds = Array.from(new Set([userId, ...(participants || [])].filter(Boolean)));
    const adminIds = Array.from(new Set([userId, ...(admins || [])].filter(Boolean)));

    const channel = await Group.create({
      participants: participantIds,
      admins: adminIds,
      image,
      name: name?.trim(),
      description: description?.trim()
    });

    return {
      statusCode: '201',
      message: 'Channel created successfully.',
      channel
    };
  } catch (error) {
    return {
      statusCode: '400',
      message: error.message || 'Failed to create channel'
    };
  }
};

const updateGroup = async ({ id, group, userId }) => {
  try {
    const existingGroup = await Group.findOne({ id });
    if (!existingGroup) {
      return {
        statusCode: '404',
        message: 'channel not found.'
      };
    }

    if (!existingGroup.admins.includes(userId)) {
      return {
        statusCode: '403',
        message: 'Only channel admins can update this channel.'
      };
    }

    const allowedGroupUpdates = {
      image: group.image,
      name: group.name?.trim(),
      description: group.description?.trim(),
      participants: group.participants,
      admins: group.admins
    };
    const updates = Object.fromEntries(
      Object.entries(allowedGroupUpdates).filter(([, value]) => value !== undefined)
    );

    const updatedGroup = await Group.findOneAndUpdate(
      { id },
      updates,
      { new: true }
    );

    if (!updatedGroup) {
      return {
        statusCode: '404',
        message: 'channel not found.'
      };
    }

    return {
      statusCode: '200',
      message: 'channel updated successfully.'
    };
  } catch (error) {
    return {
      statusCode: '404',
      message: 'channel not found.'
    };
  }
};

const deleteGroup = async ({ id, userId }) => {
  try {
    const group = await Group.findOne({ id });
    
    if (!group) {
      return {
        statusCode: '404',
        message: 'channel not found.'
      };
    }

    if (!group.admins.includes(userId)) {
      return {
        statusCode: '403',
        message: 'Only channel admins can delete this channel.'
      };
    }

    // Delete all messages in the group
    await Message.deleteMany({ channelId: id });

    // Delete the group
    await Group.deleteOne({ id });

    return {
      statusCode: '200',
      message: 'channel deleted successfully.'
    };
  } catch (error) {
    return {
      statusCode: '404',
      message: 'channel not found.'
    };
  }
};

export  {
  getGroup,
  getGroupsByUser,
  createGroup,
  updateGroup,
  deleteGroup
};

