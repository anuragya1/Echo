import { Router } from 'express';
import { login, refresh, register } from '../controllers/auth.controller.js';
import { localAuthMiddleware } from '../middlewares/auth.middleware.js';
import { rateLimit } from '../middlewares/rateLimit.middleware.js';
import { validateAuthPayload, validateRegisterPayload } from '../middlewares/validation.middleware.js';

const router = Router();

router.post('/login', rateLimit({ keyPrefix: 'login', max: 10, windowMs: 60000 }), validateAuthPayload, localAuthMiddleware, login);
router.post('/register', rateLimit({ keyPrefix: 'register', max: 5, windowMs: 60000 }), validateRegisterPayload, register);
router.post('/refresh', rateLimit({ keyPrefix: 'refresh', max: 30, windowMs: 60000 }), refresh);

export default router;
