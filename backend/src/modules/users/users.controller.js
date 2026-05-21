import * as usersService from './users.service.js';
import { AppError } from '../../middleware/error.js';

export async function checkUsername(req, res, next) {
  try {
    const result = await usersService.checkUsername(req.query.value);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

export async function getProfile(req, res, next) {
  try {
    let viewerId = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
        viewerId = payload.id;
      } catch (e) {
        // ignore invalid token for public profile
      }
    }

    const profile = await usersService.getProfile(req.params.username, viewerId);
    if (!profile) throw new AppError(404, 'NOT_FOUND', 'User not found');
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  try {
    const user = await usersService.updateMe(req.user.id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function getFollowingUsers(req, res, next) {
  try {
    const users = await usersService.getFollowingUsers(req.user.id);
    res.json(users);
  } catch (err) {
    next(err);
  }
}
