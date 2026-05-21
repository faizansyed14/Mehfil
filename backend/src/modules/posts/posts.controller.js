import * as postsService from './posts.service.js';
import { AppError } from '../../middleware/error.js';

export async function createPost(req, res, next) {
  try {
    const post = await postsService.createPost(req.user.id, req.body);
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}

export async function getPosts(req, res, next) {
  try {
    const result = await postsService.getPosts({
      ...req.query,
      viewerId: req.user?.id
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getFollowingPosts(req, res, next) {
  try {
    const result = await postsService.getPosts({ 
      ...req.query, 
      followingOf: req.user.id,
      viewerId: req.user?.id
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getMyPosts(req, res, next) {
  try {
    const result = await postsService.getPosts({ 
      ...req.query, 
      authorId: req.user.id,
      viewerId: req.user.id
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getPost(req, res, next) {
  try {
    const post = await postsService.getPost(req.params.id, req.user?.id);
    if (!post) throw new AppError(404, 'NOT_FOUND', 'Post not found');
    res.json(post);
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req, res, next) {
  try {
    const post = await postsService.updatePost(req.params.id, req.user.id, req.body);
    if (!post) throw new AppError(403, 'FORBIDDEN', 'Cannot update post');
    res.json(post);
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req, res, next) {
  try {
    const success = await postsService.deletePost(req.params.id, req.user.id, req.user.role);
    if (!success) throw new AppError(403, 'FORBIDDEN', 'Cannot delete post');
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
