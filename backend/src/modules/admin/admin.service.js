import prisma from '../../config/prisma.js';

export async function getStats() {
  const [userCount, postCount, commentCount, reactionCount] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.comment.count(),
    prisma.reaction.count()
  ]);

  const recentUsers = await prisma.user.findMany({
    take: 15,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      username: true,
      displayName: true,
      createdAt: true
    }
  });

  return {
    counts: {
      users: userCount,
      posts: postCount,
      comments: commentCount,
      reactions: reactionCount
    },
    recentUsers
  };
}

export async function getAllUsers(limit = 20, skip = 0) {
  return prisma.user.findMany({
    take: limit,
    skip,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          posts: true,
          followers: true
        }
      }
    }
  });
}

export async function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      username: true,
      displayName: true,
      role: true,
      email: true
    }
  });
}

export async function deleteUser(id) {
  return prisma.user.delete({
    where: { id }
  });
}
