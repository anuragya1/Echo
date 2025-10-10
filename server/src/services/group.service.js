import { Group } from '../models/group.model.js';
import User from '../models/user.model.js';
import { Message } from '../models/message.model.js';

const getGroup = async (id) => {
  try {
    const group = await Group.findOne({ id });
    
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
      .select('-messages -createdAt');

    // Get last message for each group
    const lastMessages = [];
    for (let i = 0; i < channels.length; i++) {
      const lastMessage = await Message.findOne({
        channelId: channels[i].id
      })
        .sort({ createdAt: -1 })
        .limit(1);
      
      lastMessages.push(lastMessage);
    }

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

const createGroup = async ({ participants, admins, image, name, description }) => {
  try {
    const channel = await Group.create({
      participants: participants || [],
      admins: admins || [],
      image,
      name,
      description
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

const updateGroup = async ({ id, group }) => {
  try {
    const updatedGroup = await Group.findOneAndUpdate(
      { id },
      group,
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

const deleteGroup = async (id) => {
  try {
    const group = await Group.findOne({ id });
    
    if (!group) {
      return {
        statusCode: '404',
        message: 'channel not found.'
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

