import prisma from '../../config/prisma.js';

function buildPostSearchWhere(term) {
  const lower = term.toLowerCase();
  return {
    OR: [
      { title: { contains: term, mode: 'insensitive' } },
      { body: { contains: term, mode: 'insensitive' } },
      { tags: { has: lower } },
      { author: { username: { contains: term, mode: 'insensitive' } } },
      { author: { displayName: { contains: term, mode: 'insensitive' } } },
    ],
  };
}

function buildUserSearchWhere(term) {
  return {
    OR: [
      { username: { contains: term, mode: 'insensitive' } },
      { displayName: { contains: term, mode: 'insensitive' } },
    ],
  };
}

export async function search({ q, limit = 8, viewerId = null }) {
  const term = q.trim();
  if (!term) {
    return { users: [], posts: [] };
  }

  const [users, posts] = await Promise.all([
    prisma.user.findMany({
      where: buildUserSearchWhere(term),
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        _count: { select: { posts: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
    prisma.post.findMany({
      where: buildPostSearchWhere(term),
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, username: true, displayName: true },
        },
        _count: {
          select: { comments: true, reactions: true },
        },
      },
    }),
  ]);

  let followingAuthorIds = new Set();
  if (viewerId && posts.length > 0) {
    const follows = await prisma.follow.findMany({
      where: {
        followerId: viewerId,
        followingId: { in: posts.map((p) => p.authorId) },
      },
      select: { followingId: true },
    });
    followingAuthorIds = new Set(follows.map((f) => f.followingId));
  }

  const postsWithStatus = posts.map((p) => ({
    ...p,
    author: {
      ...p.author,
      isFollowing: followingAuthorIds.has(p.authorId),
    },
  }));

  return {
    users: users.map(({ _count, ...u }) => ({
      ...u,
      postCount: _count.posts,
    })),
    posts: postsWithStatus,
  };
}
