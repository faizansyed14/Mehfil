import prisma from '../../config/prisma.js';

export async function toggleReaction(postId, userId, type) {
  const existing = await prisma.reaction.findUnique({
    where: {
      postId_userId_type: { postId, userId, type }
    }
  });

  if (existing) {
    await prisma.reaction.delete({
      where: { id: existing.id }
    });
    return { reacted: false };
  } else {
    await prisma.reaction.create({
      data: { postId, userId, type }
    });
    return { reacted: true };
  }
}

export async function getReactionSummary(postId, userId) {
  const reactions = await prisma.reaction.groupBy({
    by: ['type'],
    where: { postId },
    _count: true
  });

  const mine = userId ? await prisma.reaction.findMany({
    where: { postId, userId },
    select: { type: true }
  }) : [];

  const summary = {
    RESONATE: 0,
    MOVED: 0,
    mine: mine.map(r => r.type)
  };

  reactions.forEach(r => {
    summary[r.type] = r._count;
  });

  return summary;
}
