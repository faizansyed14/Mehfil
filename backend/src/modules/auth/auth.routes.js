import { Router } from 'express';
import * as authController from './auth.controller.js';
import { signupSchema, signinSchema } from './auth.schemas.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';
import { authLimiter } from '../../middleware/rateLimit.js';

const router = Router();

router.post('/signup', authLimiter, validate(signupSchema), authController.signup);
router.post('/signin', authLimiter, validate(signinSchema), authController.signin);
router.post('/refresh', authController.refresh);
router.post('/signout', authController.signout);
router.get('/me', requireAuth, authController.getMe);

export default router;
