import prisma from '../../config/prisma.js';

export async function createPost(authorId, data) {
  const { tags, ...rest } = data;
  return prisma.post.create({
    data: {
      ...rest,
      authorId,
      tags: tags.map(t => t.toLowerCase().trim())
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true
        }
      }
    }
  });
}

export async function getPosts({ limit = 20, cursor, tag, authorId, followingOf, search, viewerId }) {
  const query = {
    take: limit,
    orderBy: { createdAt: 'desc' },
    where: {},
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true
        }
      },
      _count: {
        select: {
          comments: true,
          reactions: true
        }
      }
    }
  };


  if (cursor) {
    query.skip = 1;
    query.cursor = { id: cursor };
  }

  if (tag) {
    query.where.tags = { has: tag.toLowerCase() };
  }

  if (authorId) {
    query.where.authorId = authorId;
  }

  if (followingOf) {
    const following = await prisma.follow.findMany({
      where: { followerId: followingOf },
      select: { followingId: true }
    });
    query.where.authorId = { in: following.map(f => f.followingId) };
  }

  if (search) {
    const term = search.trim();
    const searchCondition = {
      OR: [
        { title: { contains: term, mode: 'insensitive' } },
        { body: { contains: term, mode: 'insensitive' } },
        { tags: { has: term.toLowerCase() } },
        { author: { username: { contains: term, mode: 'insensitive' } } },
        { author: { displayName: { contains: term, mode: 'insensitive' } } },
      ],
    };
    query.where = { ...query.where, ...searchCondition };
  }

  const posts = await prisma.post.findMany(query);

  let followingAuthorIds = new Set();
  if (viewerId) {
    const follows = await prisma.follow.findMany({
      where: {
        followerId: viewerId,
        followingId: { in: posts.map(p => p.authorId) }
      },
      select: { followingId: true }
    });
    followingAuthorIds = new Set(follows.map(f => f.followingId));
  }

  let postsWithStatus = posts.map(p => ({
    ...p,
    author: {
      ...p.author,
      isFollowing: followingAuthorIds.has(p.authorId)
    }
  }));

  if (viewerId) {
    const postIds = posts.map(p => p.id);
    const userReactions = await prisma.reaction.findMany({
      where: {
        userId: viewerId,
        postId: { in: postIds }
      },
      select: { postId: true, type: true }
    });

    const reactionMap = userReactions.reduce((acc, r) => {
      if (!acc[r.postId]) acc[r.postId] = [];
      acc[r.postId].push(r.type);
      return acc;
    }, {});

    postsWithStatus = postsWithStatus.map(p => ({
      ...p,
      userReactions: reactionMap[p.id] || []
    }));
  } else {
    postsWithStatus = postsWithStatus.map(p => ({
      ...p,
      userReactions: []
    }));
  }

  const nextCursor = posts.length === limit ? posts[posts.length - 1].id : null;

  return { posts: postsWithStatus, nextCursor };
}

export async function getPost(id, viewerId) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          bio: true
        }
      },
      _count: {
        select: {
          comments: true,
          reactions: true
        }
      }
    }
  });

  if (!post) return null;

  if (viewerId) {
    const [follow, userReactions] = await Promise.all([
      prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: viewerId,
            followingId: post.authorId
          }
        }
      }),
      prisma.reaction.findMany({
        where: { userId: viewerId, postId: id }
      })
    ]);
    
    post.author.isFollowing = !!follow;
    post.userReactions = userReactions.map(r => r.type);
  } else {
    post.userReactions = [];
  }

  return post;
}

export async function updatePost(id, userId, data) {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.authorId !== userId) return null;

  return prisma.post.update({
    where: { id },
    data: {
      ...data,
      tags: data.tags?.map(t => t.toLowerCase().trim())
    }
  });
}

export async function deletePost(id, userId, userRole) {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return false;

  if (post.authorId !== userId && userRole !== 'ADMIN') return false;

  await prisma.post.delete({ where: { id } });
  return true;
}
