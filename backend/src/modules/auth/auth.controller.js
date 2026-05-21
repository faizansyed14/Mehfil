import * as authService from './auth.service.js';
import { env } from '../../config/env.js';
import { AppError } from '../../middleware/error.js';

const COOKIE_NAME = 'refresh_token';

function setRefreshCookie(res, token) {
  const isProd = env.NODE_ENV === 'production';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax', // Must be 'none' for cross-origin on Render
    path: '/',
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
  });
}

export async function signup(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await authService.signup(req.body);
    setRefreshCookie(res, refreshToken);
    res.status(201).json({ user, accessToken });
  } catch (err) {
    next(err);
  }
}

export async function signin(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await authService.signin(req.body);
    setRefreshCookie(res, refreshToken);
    res.json({ user, accessToken });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token || token === 'undefined' || token === 'null') {
      throw new AppError(401, 'INVALID_TOKEN', 'No refresh token provided');
    }
    
    const { user, accessToken, refreshToken } = await authService.refresh(token);
    setRefreshCookie(res, refreshToken);
    res.json({ user, accessToken });
  } catch (err) {
    // Clear cookie on failed refresh
    res.clearCookie(COOKIE_NAME, { path: '/' });
    next(err);
  }
}

export async function signout(req, res, next) {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (token) {
      await authService.signout(token);
    }
    res.clearCookie(COOKIE_NAME, { path: '/' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res) {
  // req.user added by requireAuth middleware
  res.json({ user: req.user });
}
