import  express from 'express'
const router = express.Router();
import * as userController from "../controllers/user.controller.js"
import { jwtAuthMiddleware, requireSelfParam } from '../middlewares/auth.middleware.js';
import { rateLimit } from '../middlewares/rateLimit.middleware.js';
import { validateRelationPayload } from '../middlewares/validation.middleware.js';

router.get('', jwtAuthMiddleware, rateLimit({ keyPrefix: 'user-search', max: 60, windowMs: 60000 }), userController.getUsersBySearch);
router.get('/:id', jwtAuthMiddleware, userController.getUser);
router.put('/:id', jwtAuthMiddleware, requireSelfParam('id'), userController.updateUser);
router.get('/:id/request', jwtAuthMiddleware, requireSelfParam('id'), userController.getRequest);
router.put('/:id/request', jwtAuthMiddleware, requireSelfParam('id'), validateRelationPayload, userController.setRequest);
router.get('/:id/friend', jwtAuthMiddleware, userController.getFriends);
router.put('/:id/friend', jwtAuthMiddleware, requireSelfParam('id'), validateRelationPayload, userController.setFriend);
router.get('/:id/block', jwtAuthMiddleware, requireSelfParam('id'), userController.getBlocked);
router.put('/:id/block', jwtAuthMiddleware, requireSelfParam('id'), validateRelationPayload, userController.setBlocked);

export default router;
