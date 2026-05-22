import { motion } from 'framer-motion';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { usersApi } from '../api/users.api';
import { postsApi } from '../api/posts.api';
import { useAuthStore } from '../store/authStore';
import { InitialsAvatar } from '../components/layout/Sidebar';
import FollowButton from '../components/features/FollowButton';
import PostCard from '../components/features/PostCard';
import { useInfiniteFeed } from '../hooks/useInfiniteFeed';
import { useInView } from 'react-intersection-observer';
import { Loader2, Calendar } from 'lucide-react';
import { formatCount } from '../lib/format';

export default function ProfilePage() {
  const { username: paramUsername } = useParams();
  const { user: currentUser } = useAuthStore();
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();

  const username = paramUsername || currentUser?.username;

  // If no username (not logged in and no param), redirect to signin
  if (!username && !currentUser) return <Navigate to="/signin" />;

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => usersApi.getProfile(username),
    enabled: !!username,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState('');

  useEffect(() => {
    if (profile) setEditedBio(profile.bio || '');
  }, [profile]);

  const {
    data: feedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: feedStatus,
  } = useInfiniteFeed(`user-${username}`, (params) => 
    postsApi.getPosts({ ...params, authorId: profile?.id }),
    { enabled: !!profile?.id }
  );

  const updateProfileMutation = useMutation({
    mutationFn: (data) => usersApi.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
      setIsEditing(false);
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isProfileLoading) return (
    <div className="flex justify-center py-24">
      <Loader2 className="animate-spin text-[var(--ink-faint)]" />
    </div>
  );

  if (!profile) return (
    <div className="text-center py-24 text-[var(--ink-faint)]">
      Writer not found.
    </div>
  );

  const isOwnProfile = currentUser?.id === profile.id;
  const joinedDate = new Date(profile.createdAt).toLocaleDateString(undefined, { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-12"
    >
      {/* Header */}
      <header className="space-y-6 min-w-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <InitialsAvatar name={profile.displayName} size={64} />
            <div className="min-w-0">
              <h1 className="font-display text-xl sm:text-2xl font-bold text-[var(--ink)] truncate">
                {profile.displayName}
              </h1>
              <p className="text-sm text-[var(--ink-muted)] truncate">@{profile.username}</p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0 self-start">
            {isOwnProfile ? (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest border border-[var(--line)] rounded-full hover:bg-[var(--accent-soft)] transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            ) : (
              <FollowButton 
                username={profile.username} 
                isFollowing={profile.isFollowing} 
              />
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4 max-w-lg">
            <textarea
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              placeholder="Tell the gathering about your soul..."
              className="w-full min-w-0 p-4 surface-card rounded-xl text-base outline-none focus:ring-2 focus:ring-[var(--accent-soft)] min-h-[100px] resize-y"
              maxLength={280}
            />
            <button
              onClick={() => updateProfileMutation.mutate({ bio: editedBio })}
              disabled={updateProfileMutation.isPending}
              className="bg-[var(--ink)] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full hover:opacity-90 disabled:opacity-50 transition-all shadow-sm min-h-[44px]"
            >
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Description'}
            </button>
          </div>
        ) : (
          profile.bio ? (
            <p className="text-base text-[var(--ink)] leading-relaxed max-w-lg whitespace-pre-wrap">
              {profile.bio}
            </p>
          ) : isOwnProfile ? (
            <p className="text-sm text-[var(--ink-faint)] italic border border-dashed border-[var(--line)] p-4 rounded-xl max-w-lg">
              You haven't shared your story yet. Click Edit Profile to add a bio.
            </p>
          ) : null
        )}

        <div className="flex flex-wrap gap-6 text-sm pt-2">
          <div className="flex items-center gap-1.5 text-[var(--ink-faint)]">
            <Calendar size={14} />
            Joined {joinedDate}
          </div>
          <div className="flex gap-6">
            <div className="flex gap-1.5">
              <span className="font-bold text-[var(--ink)]">
                {formatCount(profile.stats.followers)}
              </span>
              <span className="text-[var(--ink-muted)]">Followers</span>
            </div>
            <div className="flex gap-1.5">
              <span className="font-bold text-[var(--ink)]">
                {formatCount(profile.stats.following)}
              </span>
              <span className="text-[var(--ink-muted)]">Following</span>
            </div>
          </div>
        </div>
      </header>

      {/* User's Posts */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-[var(--line)] pb-4">
          <h2 className="font-display text-lg font-bold">
            Verses
          </h2>
          <span className="text-[var(--ink-faint)] text-xs font-mono">({profile.stats.posts})</span>
        </div>

        <div className="space-y-6">
          {feedStatus === 'pending' ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-[var(--ink-faint)]" />
            </div>
          ) : (
            <>
              {feedData?.pages.map((page) =>
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

              {feedData?.pages[0].posts.length === 0 && (
                <div className="text-center py-16 px-4 bg-[var(--bg-elev)] rounded-2xl border border-dashed border-[var(--line)]">
                  <p className="text-sm text-[var(--ink-faint)] italic">
                    {isOwnProfile 
                      ? "Your ink has yet to touch the page." 
                      : "This poet has yet to share their soul with the gathering."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </motion.div>
  );
}
