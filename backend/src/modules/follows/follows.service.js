import prisma from '../../config/prisma.js';
import { AppError } from '../../middleware/error.js';

export async function follow(followerId, usernameToFollow) {
  const followee = await prisma.user.findUnique({
    where: { username: usernameToFollow }
  });

  if (!followee) throw new AppError(404, 'NOT_FOUND', 'User not found');
  if (followee.id === followerId) throw new AppError(400, 'BAD_REQUEST', 'Cannot follow yourself');

  return prisma.follow.upsert({
    where: {
      followerId_followingId: {
        followerId,
        followingId: followee.id
      }
    },
    update: {},
    create: {
      followerId,
      followingId: followee.id
    }
  });
}

export async function unfollow(followerId, usernameToUnfollow) {
  const followee = await prisma.user.findUnique({
    where: { username: usernameToUnfollow }
  });

  if (!followee) throw new AppError(404, 'NOT_FOUND', 'User not found');

  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: followee.id
        }
      }
    });
    return true;
  } catch (err) {
    return false;
  }
}

export async function isFollowing(followerId, followingId) {
  const f = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId }
    }
  });
  return !!f;
}
