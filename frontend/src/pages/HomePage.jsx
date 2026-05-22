import { motion } from 'framer-motion';
import PostComposer from '../components/features/PostComposer';
import PostCard from '../components/features/PostCard';
import { useInfiniteFeed } from '../hooks/useInfiniteFeed';
import { postsApi } from '../api/posts.api';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const TITLE = 'Mehfil';

const letterVariants = {
  hidden: { opacity: 0, y: 24, rotateX: -40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: 0.15 + i * 0.07,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

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
    (params) =>
      feedType === 'all'
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
      <header className="mb-8 sm:mb-10 flex flex-col items-center justify-center text-center w-full gap-5">
        <div className="flex flex-col items-center">
          <motion.h1
            className="font-display text-4xl sm:text-5xl font-semibold leading-tight text-[var(--ink)] flex justify-center"
            initial="hidden"
            animate="visible"
            style={{ perspective: 600 }}
          >
            {TITLE.split('').map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                custom={i}
                variants={letterVariants}
                className="inline-block origin-bottom text-[var(--ink)]"
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  y: {
                    delay: 1.2 + i * 0.12,
                    duration: 2.5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                  },
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="mt-2 text-sm text-[var(--ink-muted)] italic"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
          >
            a gathering for verse
          </motion.p>
        </div>

        {user && (
          <motion.div
            className="flex gap-1 p-1 surface-card rounded-full"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.85, duration: 0.4, ease: 'easeOut' }}
          >
            <button
              onClick={() => setFeedType('all')}
              className={`px-5 sm:px-6 py-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-full transition-all min-h-[40px] ${
                feedType === 'all'
                  ? 'bg-[var(--ink)] text-white shadow-sm'
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFeedType('following')}
              className={`px-5 sm:px-6 py-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-full transition-all min-h-[40px] ${
                feedType === 'following'
                  ? 'bg-[var(--ink)] text-white shadow-sm'
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
              }`}
            >
              Following
            </button>
          </motion.div>
        )}
      </header>

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

            <div ref={ref} className="h-10 flex justify-center items-center">
              {isFetchingNextPage && (
                <Loader2 size={20} className="animate-spin text-[var(--ink-faint)]" />
              )}
            </div>

            {!hasNextPage && data.pages[0].posts.length > 0 && (
              <p className="text-center py-8 text-xs text-[var(--ink-faint)] italic">
                You&apos;ve reached the end of the Gathering.
              </p>
            )}

            {data.pages[0].posts.length === 0 && (
              <div className="text-center py-16 text-sm text-[var(--ink-faint)]">
                No poems yet. Be the first to share.
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
