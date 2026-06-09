import express from 'express'
const router = express.Router();
import * as messageController from "../controllers/message.controller.js"
import { jwtAuthMiddleware } from '../middlewares/auth.middleware.js';
import { rateLimit } from '../middlewares/rateLimit.middleware.js';
import { validateMessagePayload } from '../middlewares/validation.middleware.js';
// Get single message (protected)
router.get('/:id', jwtAuthMiddleware, messageController.getMessage);


router.get('/channel/:id', jwtAuthMiddleware, rateLimit({ keyPrefix: 'message-history', max: 120, windowMs: 60000 }), messageController.getMessagesByChannel);

// Create message
router.post('', jwtAuthMiddleware, rateLimit({ keyPrefix: 'message-create', max: 60, windowMs: 60000 }), validateMessagePayload, messageController.createMessage);

// Update message (protected)
router.put('/:id', jwtAuthMiddleware, messageController.updateMessage);

// Delete message (protected)
router.delete('/:id', jwtAuthMiddleware, messageController.deleteMessage);

export default router;
