import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteFeed } from '../hooks/useInfiniteFeed';
import { postsApi } from '../api/posts.api';
import PostCard from '../components/features/PostCard';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { Loader2, Search } from 'lucide-react';
import SearchBox from '../components/features/SearchBox';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { ref, inView } = useInView();
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteFeed(`search-${query}`, (params) => 
    postsApi.getPosts({ ...params, search: query })
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
      className="space-y-8 pb-12"
    >
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold">Search</h1>
        <SearchBox />
      </div>

      {query && (
        <div className="space-y-6">
          <p className="text-sm text-[var(--ink-muted)]">
            Showing results for <span className="font-semibold text-[var(--ink)]">"{query}"</span>
          </p>

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
                  <div className="text-center py-16 flex flex-col items-center gap-4">
                    <Search size={48} className="text-[var(--ink-faint)] opacity-20" />
                    <p className="text-[var(--ink-faint)] text-sm">No verses match your search.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
