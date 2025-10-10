import express from 'express'
const router = express.Router();
import * as messageController from "../controllers/message.controller.js"
import { jwtAuthMiddleware } from '../middlewares/auth.middleware.js';
// Get single message (protected)
router.get('/:id', jwtAuthMiddleware, messageController.getMessage);


router.get('/channel/:id', messageController.getMessagesByChannel);

// Create message
router.post('', messageController.createMessage);

// Update message (protected)
router.put('/:id', jwtAuthMiddleware, messageController.updateMessage);

// Delete message (protected)
router.delete('/:id', jwtAuthMiddleware, messageController.deleteMessage);

export default router;