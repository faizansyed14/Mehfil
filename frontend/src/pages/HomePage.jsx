import { motion } from 'framer-motion';
import PostComposer from '../components/features/PostComposer';
import PostCard from '../components/features/PostCard';
import { useInfiniteFeed } from '../hooks/useInfiniteFeed';
import { postsApi } from '../api/posts.api';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function HomePage() {
  const { user } = useAuthStore();
  const [feedType, setFeedType] = useState('all');
  const { ref, inView } = useInView();
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteFeed(
    `feed-${feedType}`, 
    (params) => feedType === 'all' 
      ? postsApi.getPosts(params) 
      : postsApi.getFollowing(params),
    { enabled: feedType === 'all' || !!user }
  );

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
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1
            className="font-display"
            style={{ fontSize: '2.25rem', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2 }}
          >
            Mehfil
          </h1>
          <p
            className="mt-1"
            style={{ fontSize: '0.875rem', color: 'var(--ink-muted)', fontStyle: 'italic' }}
          >
            a gathering for verse
          </p>
        </div>

        {user && (
          <div className="flex gap-1 p-1 bg-[var(--bg-elev)] border border-[var(--line)] rounded-full self-start">
            <button
              onClick={() => setFeedType('all')}
              className={`px-6 py-1.5 text-[xs] font-bold tracking-widest uppercase rounded-full transition-all duration-300 ${
                feedType === 'all' 
                  ? 'bg-[var(--ink)] text-white shadow-sm' 
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFeedType('following')}
              className={`px-6 py-1.5 text-[xs] font-bold tracking-widest uppercase rounded-full transition-all duration-300 ${
                feedType === 'following' 
                  ? 'bg-[var(--ink)] text-white shadow-sm' 
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
              }`}
            >
              Following
            </button>
          </div>
        )}
      </div>

      <PostComposer />

      <div className="space-y-6">
        {status === 'pending' ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-[var(--ink-faint)]" />
          </div>
        ) : status === 'error' ? (
          <p className="text-center text-[var(--accent)] text-sm">Error loading poems.</p>
        ) : (
          <>
            {data.pages.map((page) =>
              page.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
            
            {/* Infinite Scroll Trigger */}
            <div ref={ref} className="h-10 flex justify-center items-center">
              {isFetchingNextPage && (
                <Loader2 size={20} className="animate-spin text-[var(--ink-faint)]" />
              )}
            </div>
            
            {!hasNextPage && data.pages[0].posts.length > 0 && (
              <p className="text-center py-8 text-xs text-[var(--ink-faint)] italic">
                You've reached the end of the Gathering.
              </p>
            )}
            
            {data.pages[0].posts.length === 0 && (
              <div
                className="text-center py-16"
                style={{ color: 'var(--ink-faint)', fontSize: '0.875rem' }}
              >
                No poems yet. Be the first to share.
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
