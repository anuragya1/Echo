import authService from '../services/auth.service.js';

export const login = async (req, res) => {
  try {
    const tokenData = await authService.login(req.user);
    res.status(200).json(tokenData);
  } catch (error) {
    res.status(401).json({ message: 'Login failed' });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password, image } = req.body;
    const result = await authService.register({ username, email, password, image });
    res.status(201).json(result);
  } catch (error) {
    if (error.status === 409) {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Registration failed' });
    }
  }
};