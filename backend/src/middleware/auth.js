import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './error.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError(401, 'UNAUTHORIZED', 'Missing or invalid authorization header');
  }

  try {
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    req.user = payload;
    next();
  } catch {
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid or expired token');
  }
}

export function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    req.user = payload;
  } catch {
    // If token is invalid, just ignore it and continue as guest
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    throw new AppError(403, 'FORBIDDEN', 'Admin access required');
  }
  next();
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      throw new AppError(403, 'FORBIDDEN', `Access restricted to ${role} role`);
    }
    next();
  };
}
