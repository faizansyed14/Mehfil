import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '../api/posts.api';
import PostCard from '../components/features/PostCard';
import CommentThread from '../components/features/CommentThread';
import { Loader2 } from 'lucide-react';

export default function PostDetailPage() {
  const { id } = useParams();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postsApi.getPost(id),
  });

  if (isLoading) return (
    <div className="flex justify-center py-24">
      <Loader2 className="animate-spin text-[var(--ink-faint)]" />
    </div>
  );

  if (error || !post) return (
    <div className="text-center py-24 text-[var(--accent)]">
      Post not found or an error occurred.
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
      className="space-y-8 pb-12"
    >
      <PostCard post={post} />
      
      <div className="border-t border-[var(--line)]">
        <CommentThread postId={post.id} />
      </div>
    </motion.div>
  );
}
