import { Router } from 'express';
const router = Router();

import { isAuthenticated } from '@middleware/AuthMiddleware';
import * as ChatController from '@controllers/ChatController';

// TODO: Check if authenticated
router.get('/status',
  isAuthenticated, ChatController.getStatus
);

router.post('/message',
  isAuthenticated, ChatController.postMessage
);

export default router;
