import { Router } from 'express';
import * as searchController from './search.controller.js';
import { searchQuerySchema } from './search.schemas.js';
import { validateQuery } from '../../middleware/validate.js';
import { optionalAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, validateQuery(searchQuerySchema), searchController.search);

export default router;
