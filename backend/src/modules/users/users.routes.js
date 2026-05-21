import { Router } from 'express';
import * as usersController from './users.controller.js';
import { checkUsernameSchema, updateMeSchema } from './users.schemas.js';
import { validate, validateQuery } from '../../middleware/validate.js';
import { requireAuth, optionalAuth } from '../../middleware/auth.js';

import * as followsController from '../follows/follows.controller.js';

const router = Router();

router.get('/check-username', validateQuery(checkUsernameSchema), usersController.checkUsername);
router.get('/me/following', requireAuth, usersController.getFollowingUsers);
router.get('/:username', optionalAuth, usersController.getProfile);
router.patch('/me', requireAuth, validate(updateMeSchema), usersController.updateMe);

router.post('/:username/follow', requireAuth, followsController.follow);
router.delete('/:username/follow', requireAuth, followsController.unfollow);

export default router;
