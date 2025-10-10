
import * as groupService from "../services/group.service.js"

const getGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const channel = await groupService.getGroup(id);
    res.json(channel);
  } catch (error) {
    next(error);
  }
};

const getGroupByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const channels= await groupService.getGroupsByUser(userId);
    res.json(channels);
  } catch (error) {
    next(error);
  }
};

const createGroup = async (req, res, next) => {
  try {
    const result = await groupService.createGroup(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const updateGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await groupService.updateGroup({ id, group: req.body });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await groupService.deleteGroup(id);
    res.json(result);
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