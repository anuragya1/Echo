import  express from 'express'
const router = express.Router();
import * as userController from "../controllers/user.controller.js"
import { jwtAuthMiddleware } from '../middlewares/auth.middleware.js';

router.get('/:id', userController.getUser);
router.get('', userController.getUsersBySearch);
router.put('/:id', jwtAuthMiddleware, userController.updateUser);
router.get('/:id/request', userController.getRequest);
router.put('/:id/request', jwtAuthMiddleware, userController.setRequest);
router.get('/:id/friend', userController.getFriends);
router.put('/:id/friend', jwtAuthMiddleware, userController.setFriend);
router.get('/:id/block', userController.getBlocked);
router.put('/:id/block', jwtAuthMiddleware, userController.setBlocked);

export default router;