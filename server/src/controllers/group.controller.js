
import * as groupService from "../services/group.service.js"

const sendServiceResult = (res, result, successStatus = 200) => {
  const status = Number(result?.statusCode) || successStatus;
  res.status(status).json(result);
};

const getGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const channel = await groupService.getGroup(id, req.user.id);
    sendServiceResult(res, channel);
  } catch (error) {
    next(error);
  }
};

const getGroupByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const channels= await groupService.getGroupsByUser(userId);
    sendServiceResult(res, channels);
  } catch (error) {
    next(error);
  }
};

const createGroup = async (req, res, next) => {
  try {
    const result = await groupService.createGroup({ ...req.body, userId: req.user.id });
    sendServiceResult(res, result, 201);
  } catch (error) {
    next(error);
  }
};

const updateGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await groupService.updateGroup({ id, group: req.body, userId: req.user.id });
    sendServiceResult(res, result);
  } catch (error) {
    next(error);
  }
};

const deleteGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await groupService.deleteGroup({ id, userId: req.user.id });
    sendServiceResult(res, result);
  } catch (error) {
    next(error);
  }
};

export  {
    getGroup,
    createGroup,
    deleteGroup,
    getGroupByUserId,
    updateGroup,
}
