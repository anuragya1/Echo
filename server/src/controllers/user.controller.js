import * as userService from "../services/user.service.js";

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const getUsersBySearch = async (req, res, next) => {
  try {
    const { search } = req.query;
    const users = await userService.findBySearch(search || '');
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userService.updateUser({ id, ...req.body });
    res.json({
      statusCode: '200',
      message: 'User updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

const getRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userService.getRequests({ id });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const setRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userService.setRequest({ id, ...req.body });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getFriends = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userService.getFriends({ id });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const setFriend = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userService.setFriend({ id, ...req.body });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getBlocked = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userService.getBlocked({ id });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const setBlocked = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userService.setBlocked({ id, ...req.body });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {
  getUser,
  getUsersBySearch,
  updateUser,
  getRequest,
  setRequest,
  getFriends,
  setFriend,
  getBlocked,
  setBlocked
};
