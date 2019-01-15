import { Router } from 'express';
const router = Router();

import { isAuthenticated } from '@middleware/AuthMiddleware';
import * as ChatController from '@controllers/ChatController';


router.get('/status',
  isAuthenticated, ChatController.getStatus
);

router.post('/message',
  isAuthenticated, ChatController.postMessage
);

export default router;
