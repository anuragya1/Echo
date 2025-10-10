import express from 'express';
const router = express.Router();
import * as groupController from '../controllers/group.controller.js'
import { jwtAuthMiddleware } from '../middlewares/auth.middleware.js';
// Get group by ID
router.get('/:id', groupController.getGroup);

// Get groups by user ID
router.get('/user/:userId', groupController.getGroupByUserId);

// Create group (protected)
router.post('', jwtAuthMiddleware, groupController.createGroup);

// Update group (protected)
router.put('/:id', jwtAuthMiddleware, groupController.updateGroup);

// Delete group (protected)
router.delete('/:id', jwtAuthMiddleware, groupController.deleteGroup);

export default router;
