import { Message } from "../models/message.model.js"
import { Group } from "../models/group.model.js";
const getMessage = async ({ id }) => {
  try {
    const message = await Message.findOne({ id });
    if (!message) {
      return {
        statusCode: '404',
        message: 'Message not found.'
      };
    }
    return message;
  } catch (error) {
    return {
      statusCode: '404',
      message: 'Message not found.'
    };
  }
};

const getMessagesByChannel = async ({ id }) => {
  try {
    const messages = await Message.find({ channelId: id })
      .sort({ createdAt: 1 })
      .populate('userId', '-password');
    
    return messages;
  } catch (error) {
    return {
      statusCode: '404',
      message: 'Messages not found.'
    };
  }
};

const addMessage = async ({ text, images, channelId, userId }) => {
  try {
    const message = await Message.create({
      text,
      images: images || [],
      channelId,
      userId
    });

    // Add message ID to channel's messages array
    await Group.findOneAndUpdate(
      { id: channelId },
      { $addToSet: { messages: message.id } }
    );

    return {
      statusCode: '201',
      message: 'Message created successfully.',
      data: message
    };
  } catch (error) {
    return {
      statusCode: '400',
      message: error.message || 'Failed to create message'
    };
  }
};

const updateMessage = async ({ id, message }) => {
  try {
    const updatedMessage = await Message.findOneAndUpdate(
      { id },
      message,
      { new: true }
    );

    if (!updatedMessage) {
      return {
        statusCode: '404',
        message: 'Message not found.'
      };
    }

    return {
      statusCode: '200',
      message: 'Message updated successfully.'
    };
  } catch (error) {
    return {
      statusCode: '404',
      message: 'Message not found.'
    };
  }
};

const deleteMessage = async ({ id }) => {
  try {
    const message = await Message.findOne({ id });
    
    if (!message) {
      return {
        statusCode: '404',
        message: 'Message not found.'
      };
    }

    // Remove message ID from channel's messages array
    await Group.findOneAndUpdate(
      { id: message.channelId },
      { $pull: { messages: id } }
    );

    await Message.deleteOne({ id });

    return {
      statusCode: '200',
      message: 'Message deleted successfully.'
    };
  } catch (error) {
    return {
      statusCode: '404',
      message: 'Message not found.'
    };
  }
};

export  {
  getMessage,
  getMessagesByChannel,
  addMessage,
  updateMessage,
  deleteMessage
};