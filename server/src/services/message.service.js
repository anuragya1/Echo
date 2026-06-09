import { Message } from "../models/message.model.js"
import { Group } from "../models/group.model.js";

const isGroupMember = async ({ channelId, userId }) => {
  const group = await Group.findOne({ id: channelId, participants: userId }).select('id');
  return Boolean(group);
};

const normalizeLimit = (limit) => Math.min(Math.max(Number(limit) || 50, 1), 100);

const getMessage = async ({ id, userId }) => {
  try {
    const message = await Message.findOne({ id });
    if (!message) {
      return {
        statusCode: '404',
        message: 'Message not found.'
      };
    }

    if (!(await isGroupMember({ channelId: message.channelId, userId }))) {
      return {
        statusCode: '403',
        message: 'You are not allowed to read this message.'
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

const getMessagesByChannel = async ({ id, userId, limit, before }) => {
  try {
    if (!(await isGroupMember({ channelId: id, userId }))) {
      return {
        statusCode: '403',
        message: 'You are not allowed to read this channel.'
      };
    }

    const query = { channelId: id };
    if (before) {
      const beforeDate = new Date(before);
      if (!Number.isNaN(beforeDate.getTime())) {
        query.createdAt = { $lt: beforeDate };
      }
    }
    
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(normalizeLimit(limit));

    return {
      messages: messages.reverse(),
      nextBefore: messages.length ? messages[0].createdAt : null
    };
  } catch (error) {
    return {
      statusCode: '404',
      message: 'Messages not found.',
      error: error.message
    };
  }
};
const addMessage = async ({ text, images, channelId, userId }) => {
  try {
    if (!text?.trim() && (!images || images.length === 0)) {
      return {
        statusCode: '400',
        message: 'Message text or image is required.'
      };
    }

    if (!(await isGroupMember({ channelId, userId }))) {
      return {
        statusCode: '403',
        message: 'You are not allowed to post in this channel.'
      };
    }

    const message = await Message.create({
      text: text?.trim() || '',
      images: images || [],
      channelId,
      userId
    });

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

const updateMessage = async ({ id, message, userId }) => {
  try {
    const existingMessage = await Message.findOne({ id });
    if (!existingMessage) {
      return {
        statusCode: '404',
        message: 'Message not found.'
      };
    }

    if (existingMessage.userId !== userId) {
      return {
        statusCode: '403',
        message: 'You are not allowed to update this message.'
      };
    }

    const updatedMessage = await Message.findOneAndUpdate(
      { id },
      {
        text: message.text?.trim() ?? existingMessage.text,
        images: message.images ?? existingMessage.images
      },
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

const deleteMessage = async ({ id, userId }) => {
  try {
    const message = await Message.findOne({ id });
    
    if (!message) {
      return {
        statusCode: '404',
        message: 'Message not found.'
      };
    }

    if (message.userId !== userId) {
      return {
        statusCode: '403',
        message: 'You are not allowed to delete this message.'
      };
    }

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
