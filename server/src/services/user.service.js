import User from "../models/user.model.js";

const createNotFoundException = (message) => {
  const error = new Error(message);
  error.name = 'NotFoundException';
  error.statusCode = 404;
  return error;
};

const findByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const findById = async (id) => {
  const user = await User.findOne({ id }).select('-password');
  return user;
};

const findBySearch = async (search) => {
  const users = await User.find({
    username: { $regex: search, $options: 'i' }
  }).select('-password');
  return users;
};

const createUser = async ({ email, username, password }) => {
  const user = await User.create({
    email,
    username,
    password
  });
  return user;
};

const updateUser = async (userData) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { id: userData.id },
      userData,
      { new: true, runValidators: true }
    );
    return updatedUser;
  } catch (error) {
    if (error.code === 11000) {
      return {
        statusCode: '409',
        message: 'This username is already in use.'
      };
    }
    throw error;
  }
};

const getFriends = async ({ id }) => {
  try {
    const user = await User.findOne({ id });
    if (!user) {
      return {
        statusCode: '404',
        message: 'User not found.'
      };
    }

    const friends = await User.find({
      id: { $in: user.friends }
    }).select('-password');

    return {
      statusCode: '200',
      friends
    };
  } catch (error) {
    return {
      statusCode: '404',
      message: 'Friends not found.'
    };
  }
};

const setFriend = async ({ id, otherId, status }) => {
  const firstUser = await findById(id);
  const secondUser = await findById(otherId);

  if (!firstUser || !secondUser) {
    throw createNotFoundException('User not found.');
  }

  if (
    (firstUser.blocked && firstUser.blocked.includes(otherId)) ||
    (secondUser.blocked && secondUser.blocked.includes(id))
  ) {
    return {
      statusCode: '406',
      message: 'You cannot do this. You are blocked.'
    };
  }

  if (status && firstUser.friends && firstUser.friends.includes(otherId)) {
    return {
      statusCode: '409',
      message: 'You are already friend.'
    };
  }

  if (status) {
    await setRequest({ id: otherId, otherId: id, status: false });

    await User.findOneAndUpdate(
      { id },
      { $addToSet: { friends: otherId } }
    );
    await User.findOneAndUpdate(
      { id: otherId },
      { $addToSet: { friends: id } }
    );
  } else {
    await User.findOneAndUpdate(
      { id },
      { $pull: { friends: otherId } }
    );
    await User.findOneAndUpdate(
      { id: otherId },
      { $pull: { friends: id } }
    );
  }

  return {
    statusCode: '200',
    message: 'User updated successfully.'
  };
};

const getRequests = async ({ id }) => {
  try {
    const user = await User.findOne({ id });
    if (!user) {
      return {
        statusCode: '404',
        message: 'User not found.'
      };
    }

    const requests = await User.find({
      id: { $in: user.requests }
    }).select('-password');

    return {
      statusCode: '200',
      requests
    };
  } catch (error) {
    return {
      statusCode: '404',
      message: 'Requests not found.'
    };
  }
};

const setRequest = async ({ id, otherId, status }) => {
  const firstUser = await findById(id);
  const secondUser = await findById(otherId);

  if (!firstUser || !secondUser) {
    throw createNotFoundException('User not found.');
  }

  if (
    (firstUser.blocked && firstUser.blocked.includes(otherId)) ||
    (secondUser.blocked && secondUser.blocked.includes(id))
  ) {
    return {
      statusCode: '406',
      message: 'You cannot do this. You are blocked.'
    };
  }

  if (status && secondUser.friends && secondUser.friends.includes(id)) {
    return {
      statusCode: '406',
      message: 'You are already friends.'
    };
  }

  if (status && secondUser.requests && secondUser.requests.includes(id)) {
    return {
      statusCode: '409',
      message: 'You already sent a request to this user.'
    };
  }

  if (status) {
    await User.findOneAndUpdate(
      { id: otherId },
      { $addToSet: { requests: id } }
    );
  } else {
    await User.findOneAndUpdate(
      { id: otherId },
      { $pull: { requests: id } }
    );
  }

  return {
    statusCode: '200',
    message: 'User updated successfully.'
  };
};

const getBlocked = async ({ id }) => {
  try {
    const user = await User.findOne({ id });
    if (!user) {
      return {
        statusCode: '404',
        message: 'User not found.'
      };
    }

    const blocked = await User.find({
      id: { $in: user.blocked }
    }).select('-password');

    return {
      statusCode: '200',
      blocked
    };
  } catch (error) {
    return {
      statusCode: '404',
      message: 'Blocked not found.'
    };
  }
};

const setBlocked = async ({ id, otherId, status }) => {
  const firstUser = await findById(id);
  const secondUser = await findById(otherId);

  if (!firstUser || !secondUser) {
    throw createNotFoundException('User not found.');
  }

  if (status && firstUser.blocked && firstUser.blocked.includes(otherId)) {
    return {
      statusCode: '409',
      message: 'This user has already been blocked.'
    };
  }

  if (status) {
    await setFriend({ id, otherId, status: false });
    await setRequest({ id, otherId, status: false });

    await User.findOneAndUpdate(
      { id },
      { $addToSet: { blocked: otherId } }
    );
  } else {
    await User.findOneAndUpdate(
      { id },
      { $pull: { blocked: otherId } }
    );
  }

  return {
    statusCode: '200',
    message: 'User updated successfully.'
  };
};

export  {
  findByEmail,
  findById,
  findBySearch,
  createUser,
  updateUser,
  getFriends,
  setFriend,
  getRequests,
  setRequest,
  getBlocked,
  setBlocked
};
