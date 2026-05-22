import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PostCard from '../components/features/PostCard';
import SearchBox from '../components/features/SearchBox';
import { searchApi } from '../api/search.api';
import { Loader2, Search, User, FileText } from 'lucide-react';
import { InitialsAvatar } from '../components/layout/Sidebar';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search-results', query],
    queryFn: () => searchApi.search({ q: query, limit: 20 }),
    enabled: query.length >= 1,
  });

  const hasUsers = (data?.users?.length ?? 0) > 0;
  const hasPosts = (data?.posts?.length ?? 0) > 0;
  const isEmpty = query && !isLoading && !hasUsers && !hasPosts;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 sm:space-y-8 pb-12 min-w-0"
    >
      <div className="space-y-4 sm:space-y-6 sticky top-0 z-10 pt-1 pb-3 -mx-1 px-1 surface-glass rounded-[var(--radius-lg)]">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)] text-center sm:text-left">
          Search
        </h1>
        <SearchBox syncUrl />
      </div>

      {!query && (
        <div className="text-center py-12 sm:py-16 px-4">
          <Search size={40} className="mx-auto text-[var(--ink-faint)] opacity-30 mb-4" />
          <p className="text-sm text-[var(--ink-muted)]">
            Type to find poets and verses — results appear as you search.
          </p>
        </div>
      )}

      {query && (isLoading || isFetching) && !data && (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-[var(--ink-faint)]" />
        </div>
      )}

      {query && data && (
        <div className="space-y-8 min-w-0">
          <p className="text-sm text-[var(--ink-muted)]">
            Results for{' '}
            <span className="font-semibold text-[var(--ink)]">&ldquo;{query}&rdquo;</span>
          </p>

          {hasUsers && (
            <section className="space-y-3 min-w-0">
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--ink-muted)]">
                <User size={14} /> Poets
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {data.users.map((u) => (
                  <Link
                    key={u.id}
                    to={`/u/${u.username}`}
                    className="flex items-center gap-3 p-4 surface-card hover:border-[var(--accent)] transition-colors min-w-0"
                  >
                    <InitialsAvatar name={u.displayName} size={44} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[var(--ink)] truncate">{u.displayName}</p>
                      <p className="text-xs text-[var(--ink-muted)] truncate">@{u.username}</p>
                      {u.bio && (
                        <p className="text-xs text-[var(--ink-faint)] mt-1 line-clamp-2">{u.bio}</p>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-[var(--ink-faint)] shrink-0">
                      {u.postCount} {u.postCount === 1 ? 'verse' : 'verses'}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {hasPosts && (
            <section className="space-y-4 min-w-0">
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--ink-muted)]">
                <FileText size={14} /> Verses
              </h2>
              <div className="space-y-6">
                {data.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {isEmpty && (
            <div className="text-center py-16 flex flex-col items-center gap-4 px-4">
              <Search size={48} className="text-[var(--ink-faint)] opacity-20" />
              <p className="text-[var(--ink-faint)] text-sm">
                No poets or verses match your search.
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
