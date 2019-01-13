import { Router } from 'express';
const router = Router();

import { isAuthenticated } from '@middleware/AuthMiddleware';
import * as AuthController from '@controllers/AuthController';

router.post('/login', AuthController.login);
router.post('/logout', isAuthenticated, AuthController.logout);

export default router;
