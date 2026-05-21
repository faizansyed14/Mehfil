import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import { InitialsAvatar } from '../components/layout/Sidebar';
import { Loader2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import FollowButton from '../components/features/FollowButton';

export default function FollowingFeedPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['following-users'],
    queryFn: () => usersApi.getFollowing(),
    staleTime: 0,       // Always treat as stale → always re-fetch on mount
    gcTime: 0,          // Don't keep old data in cache when unmounted
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--ink)]">Following</h1>
          <p className="text-sm text-[var(--ink-muted)] italic mt-1">Poets you've gathered with.</p>
        </div>
        {users && (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[var(--bg-elev)] rounded-full border border-[var(--line)]">
            <Users size={14} className="text-[var(--ink-muted)]" />
            <span className="text-xs font-bold font-mono">{users.length}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-[var(--ink-faint)]" />
          </div>
        ) : users?.length === 0 ? (
          <div className="text-center py-24 bg-[var(--bg-elev)] rounded-3xl border border-dashed border-[var(--line)]">
            <p className="text-[var(--ink-faint)] italic">Your gathering is empty. Explore and follow poets.</p>
            <Link to="/" className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-[var(--accent)] hover:underline">Go to Mehfil</Link>
          </div>
        ) : (
          users?.map((u) => (
            <div 
              key={u.id} 
              className="group flex items-center justify-between p-4 bg-[var(--bg-elev)] border border-[var(--line)] rounded-2xl hover:border-[var(--accent)] transition-all duration-300"
            >
              <Link to={`/profile/${u.username}`} className="flex items-center gap-4 flex-1 min-w-0">
                <InitialsAvatar name={u.displayName} size={48} />
                <div className="min-w-0">
                  <h3 className="font-bold text-[var(--ink)] truncate">{u.displayName}</h3>
                  <p className="text-xs text-[var(--ink-muted)]">@{u.username}</p>
                </div>
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="hidden md:block text-right mr-4">
                  <p className="text-[10px] uppercase tracking-tighter text-[var(--ink-faint)] font-bold">Verses</p>
                  <p className="font-mono text-sm font-bold text-[var(--ink-muted)]">{u._count.posts}</p>
                </div>
                <FollowButton username={u.username} isFollowing={true} />
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
