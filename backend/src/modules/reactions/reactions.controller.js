import * as reactionsService from './reactions.service.js';

export async function toggle(req, res, next) {
  try {
    const result = await reactionsService.toggleReaction(req.params.postId, req.user.id, req.body.type);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getSummary(req, res, next) {
  try {
    const summary = await reactionsService.getReactionSummary(req.params.postId, req.user?.id);
    res.json(summary);
  } catch (err) {
    next(err);
  }
}
