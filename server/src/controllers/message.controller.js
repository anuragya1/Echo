import * as messageService from "../services/message.service.js";

const sendServiceResult = (res, result, successStatus = 200) => {
  const status = Number(result?.statusCode) || successStatus;
  res.status(status).json(result);
};

const getMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await messageService.getMessage({ id, userId: req.user.id });
    sendServiceResult(res, message);
  } catch (error) {
    next(error);
  }
};

const getMessagesByChannel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const messages = await messageService.getMessagesByChannel({
      id,
      userId: req.user.id,
      limit: req.query.limit,
      before: req.query.before
    });
    sendServiceResult(res, messages);
  } catch (error) {
    next(error);
  }
};

const createMessage = async (req, res, next) => {
  try {
    const result = await messageService.addMessage({ ...req.body, userId: req.user.id });
    sendServiceResult(res, result, 201);
  } catch (error) {
    next(error);
  }
};

const updateMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await messageService.updateMessage({ id, message: req.body, userId: req.user.id });
    sendServiceResult(res, result);
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await messageService.deleteMessage({ id, userId: req.user.id });
    sendServiceResult(res, result);
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
