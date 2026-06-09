const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateAuthPayload = (req, res, next) => {
  const { email, password } = req.body;

  if (!isNonEmptyString(email) || !emailPattern.test(email)) {
    return res.status(400).json({ message: 'A valid email is required' });
  }

  if (!isNonEmptyString(password)) {
    return res.status(400).json({ message: 'Password is required' });
  }

  return next();
};

export const validateRegisterPayload = (req, res, next) => {
  const { email, username, password } = req.body;

  if (!isNonEmptyString(email) || !emailPattern.test(email)) {
    return res.status(400).json({ message: 'A valid email is required' });
  }

  if (!isNonEmptyString(username) || username.trim().length < 5 || username.trim().length > 20) {
    return res.status(400).json({ message: 'Username must be between 5 and 20 characters' });
  }

  if (!isNonEmptyString(password) || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  return next();
};

export const validateMessagePayload = (req, res, next) => {
  const { text, images, channelId } = req.body;
  const hasText = isNonEmptyString(text);
  const hasImages = Array.isArray(images) && images.length > 0;

  if (!isNonEmptyString(channelId)) {
    return res.status(400).json({ message: 'channelId is required' });
  }

  if (!hasText && !hasImages) {
    return res.status(400).json({ message: 'Message text or image is required' });
  }

  return next();
};

export const validateGroupPayload = (req, res, next) => {
  const { participants, admins, name, description } = req.body;

  if (participants !== undefined && !Array.isArray(participants)) {
    return res.status(400).json({ message: 'participants must be an array' });
  }

  if (admins !== undefined && !Array.isArray(admins)) {
    return res.status(400).json({ message: 'admins must be an array' });
  }

  if (name !== undefined && typeof name !== 'string') {
    return res.status(400).json({ message: 'name must be a string' });
  }

  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ message: 'description must be a string' });
  }

  return next();
};

export const validateRelationPayload = (req, res, next) => {
  const { otherId, status } = req.body;

  if (!isNonEmptyString(otherId)) {
    return res.status(400).json({ message: 'otherId is required' });
  }

  if (typeof status !== 'boolean') {
    return res.status(400).json({ message: 'status must be a boolean' });
  }

  return next();
};
