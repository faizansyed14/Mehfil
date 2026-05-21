import * as commentsService from './comments.service.js';
import { AppError } from '../../middleware/error.js';

export async function createComment(req, res, next) {
  try {
    const comment = await commentsService.createComment(req.params.postId, req.user.id, req.body.body);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

export async function getComments(req, res, next) {
  try {
    const comments = await commentsService.getComments(req.params.postId);
    res.json(comments);
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const success = await commentsService.deleteComment(req.params.commentId, req.user.id, req.user.role);
    if (!success) throw new AppError(403, 'FORBIDDEN', 'Cannot delete comment');
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
