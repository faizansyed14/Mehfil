import prisma from '../../config/prisma.js';

export async function createComment(postId, authorId, body) {
  return prisma.comment.create({
    data: { postId, authorId, body },
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

export async function getComments(postId) {
  return prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: 'asc' },
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

export async function deleteComment(commentId, userId, userRole) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { post: true }
  });

  if (!comment) return false;

  // Author, Post Author, or Admin can delete
  const canDelete = 
    comment.authorId === userId || 
    comment.post.authorId === userId || 
    userRole === 'ADMIN';

  if (!canDelete) return false;

  await prisma.comment.delete({ where: { id: commentId } });
  return true;
}
