import prisma from '../../config/prisma.js';
import { sanitizeUsername, generateSuggestions } from './username.suggester.js';

export async function checkUsername(value) {
  const sanitized = sanitizeUsername(value);
  
  // Validation rules check (inline for simplicity)
  const isValid = sanitized.length >= 3 && 
                 sanitized.length <= 20 && 
                 /^[a-z0-9_]+$/.test(sanitized) &&
                 !sanitized.startsWith('_') && 
                 !sanitized.endsWith('_') &&
                 !sanitized.includes('__');

  const user = await prisma.user.findUnique({
    where: { username: sanitized }
  });

  const available = isValid && !user;
  let suggestions = [];

  if (!available) {
    const taken = await prisma.user.findMany({
      where: { username: { startsWith: sanitized } },
      select: { username: true },
      take: 20
    });
    const takenSet = new Set(taken.map(u => u.username));
    suggestions = generateSuggestions(sanitized, takenSet);
  }

  return { available, suggestions };
}

export async function getProfile(username, viewerId = null) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true
        }
      }
    }
  });

  if (!user) return null;

  let isFollowing = false;
  if (viewerId) {
    const f = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: viewerId,
          followingId: user.id
        }
      }
    });
    isFollowing = !!f;
  }

  const { passwordHash, ...safeUser } = user;
  return {
    ...safeUser,
    stats: user._count,
    isFollowing
  };
}

export async function getFollowingUsers(userId) {
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: {
          id: true,
          username: true,
          displayName: true,
          bio: true,
          _count: {
            select: { posts: true }
          }
        }
      }
    }
  });

  return follows.map(f => f.following);
}

export async function updateMe(userId, data) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      bio: true,
      role: true,
      createdAt: true
    }
  });
  return user;
}
