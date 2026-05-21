import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '../../config/prisma.js';
import { signAccessToken, signRefreshToken } from '../../lib/jwt.js';
import { AppError } from '../../middleware/error.js';
import { env } from '../../config/env.js';

export async function signup({ email, username, displayName, password }) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] }
  });

  if (existing) {
    throw new AppError(409, 'CONFLICT', 'Email or username already exists');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // Check if this user should be an admin
  const adminEmails = env.SUPERADMIN_EMAILS.split(',').map(e => e.trim());
  const role = adminEmails.includes(email) ? 'ADMIN' : 'USER';

  const user = await prisma.user.create({
    data: {
      email,
      username,
      displayName,
      passwordHash,
      role
    }
  });

  return createSession(user);
}

export async function signin({ identifier, password }) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: identifier }
      ]
    }
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email/username or password');
  }

  // Force upgrade to ADMIN if in superadmin list on signin
  const adminEmails = env.SUPERADMIN_EMAILS.split(',').map(e => e.trim());
  if (user.role !== 'ADMIN' && adminEmails.includes(user.email)) {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' }
    });
    user.role = 'ADMIN';
  }

  return createSession(user);
}

export async function refresh(tokenHash) {
  if (!tokenHash || typeof tokenHash !== 'string') {
    throw new AppError(401, 'INVALID_TOKEN', 'Malformed refresh token');
  }

  const refreshToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true }
  });

  if (!refreshToken || refreshToken.revoked || refreshToken.expiresAt < new Date()) {
    throw new AppError(401, 'INVALID_TOKEN', 'Refresh token is invalid or expired');
  }

  return createSession(refreshToken.user);
}

export async function signout(tokenHash) {
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revoked: true }
  });
}

async function createSession(user) {
  const accessToken = signAccessToken({
    id: user.id,
    username: user.username,
    role: user.role,
    displayName: user.displayName
  });

  const rawRefreshToken = crypto.randomBytes(64).toString('hex');
  const tokenHash = rawRefreshToken; // In this version we use it directly as hash for simplicity per spec "opaque random 64-byte hex"
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.REFRESH_TOKEN_TTL_DAYS);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt
    }
  });

  // Remove sensitivity
  const { passwordHash, ...userPayload } = user;

  return {
    user: userPayload,
    accessToken,
    refreshToken: rawRefreshToken
  };
}
