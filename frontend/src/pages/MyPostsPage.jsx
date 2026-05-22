import { motion } from 'framer-motion';
import { useInfiniteFeed } from '../hooks/useInfiniteFeed';
import { postsApi } from '../api/posts.api';
import PostCard from '../components/features/PostCard';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function MyPostsPage() {
  const { ref, inView } = useInView();
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteFeed('mine', postsApi.getMyPosts);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
    >
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--ink)] mb-6 sm:mb-8">
        My Posts
      </h1>

      <div className="space-y-6">
        {status === 'pending' ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-[var(--ink-faint)]" />
          </div>
        ) : (
          <>
            {data.pages.map((page) =>
              page.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
            
            <div ref={ref} className="h-4" />

            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <Loader2 size={20} className="animate-spin text-[var(--ink-faint)]" />
              </div>
            )}

            {data.pages[0].posts.length === 0 && (
              <div className="text-center py-16" style={{ color: 'var(--ink-faint)', fontSize: '0.875rem' }}>
                You haven't shared any verses yet.
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
