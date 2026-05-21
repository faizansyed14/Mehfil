import * as followsService from './follows.service.js';

export async function follow(req, res, next) {
  try {
    const result = await followsService.follow(req.user.id, req.params.username);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function unfollow(req, res, next) {
  try {
    await followsService.unfollow(req.user.id, req.params.username);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
