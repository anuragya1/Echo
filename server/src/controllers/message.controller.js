import * as messageService from "../services/message.service.js";

const getMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await messageService.getMessage({ id });
    res.json(message);
  } catch (error) {
    next(error);
  }
};

const getMessagesByChannel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const messages = await messageService.getMessagesByChannel({ id });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

const createMessage = async (req, res, next) => {
  try {
    const result = await messageService.addMessage(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const updateMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await messageService.updateMessage({ id, message: req.body });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await messageService.deleteMessage({ id });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {
  getMessage,
  getMessagesByChannel,
  createMessage,
  updateMessage,
  deleteMessage
};