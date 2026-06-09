import express from 'express';
const router = express.Router();
import * as groupController from '../controllers/group.controller.js'
import { jwtAuthMiddleware, requireSelfParam } from '../middlewares/auth.middleware.js';
import { validateGroupPayload } from '../middlewares/validation.middleware.js';

// Get groups by user ID
router.get('/user/:userId', jwtAuthMiddleware, requireSelfParam('userId'), groupController.getGroupByUserId);

// Get group by ID
router.get('/:id', jwtAuthMiddleware, groupController.getGroup);

// Create group (protected)
router.post('', jwtAuthMiddleware, validateGroupPayload, groupController.createGroup);

// Update group (protected)
router.put('/:id', jwtAuthMiddleware, validateGroupPayload, groupController.updateGroup);

// Delete group (protected)
router.delete('/:id', jwtAuthMiddleware, groupController.deleteGroup);

export default router;
