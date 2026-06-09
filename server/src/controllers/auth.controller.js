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

export const refresh = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ message: 'refresh_token is required' });
    }

    const tokenData = await authService.refresh(refresh_token);
    res.status(200).json(tokenData);
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};
