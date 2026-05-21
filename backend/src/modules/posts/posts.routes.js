import { Router } from 'express';
import * as postsController from './posts.controller.js';
import * as commentsController from '../comments/comments.controller.js';
import * as reactionsController from '../reactions/reactions.controller.js';
import { createPostSchema, updatePostSchema, postQuerySchema } from './posts.schemas.js';
import { createCommentSchema } from '../comments/comments.schemas.js';
import { validate, validateQuery } from '../../middleware/validate.js';
import { requireAuth, optionalAuth } from '../../middleware/auth.js';

const router = Router();

// Posts
router.get('/', optionalAuth, validateQuery(postQuerySchema), postsController.getPosts);
router.get('/following', requireAuth, validateQuery(postQuerySchema), postsController.getFollowingPosts);
router.get('/mine', requireAuth, validateQuery(postQuerySchema), postsController.getMyPosts);
router.get('/:id', optionalAuth, postsController.getPost);
router.post('/', requireAuth, validate(createPostSchema), postsController.createPost);
router.patch('/:id', requireAuth, validate(updatePostSchema), postsController.updatePost);
router.delete('/:id', requireAuth, postsController.deletePost);

// Comments
router.get('/:postId/comments', commentsController.getComments);
router.post('/:postId/comments', requireAuth, validate(createCommentSchema), commentsController.createComment);
router.delete('/:postId/comments/:commentId', requireAuth, commentsController.deleteComment);

// Reactions
router.get('/:postId/reactions/summary', optionalAuth, reactionsController.getSummary);
router.post('/:postId/reactions', requireAuth, reactionsController.toggle);

export default router;
