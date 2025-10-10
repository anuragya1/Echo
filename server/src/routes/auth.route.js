import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { localAuthMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', localAuthMiddleware, login);
router.post('/register', register);

export default router;