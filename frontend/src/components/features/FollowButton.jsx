import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { usersApi } from '../../api/users.api';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/cn';

export default function FollowButton({ username, isFollowing, onToggle }) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);
  const [optimisticFollowing, setOptimisticFollowing] = useState(isFollowing);

  // Sync optimistic state with prop
  useEffect(() => {
    setOptimisticFollowing(isFollowing);
  }, [isFollowing]);

  const isMe = user?.username === username;
  if (isMe || !user) return null;

  const mutation = useMutation({
    mutationFn: (shouldUnfollow) => shouldUnfollow 
      ? usersApi.unfollow(username) 
      : usersApi.follow(username),
    onMutate: async (shouldUnfollow) => {
      // Sync local state immediately
      setOptimisticFollowing(!shouldUnfollow);

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['profile', username] });
      await queryClient.cancelQueries({ queryKey: ['infinite-feed'] });
      await queryClient.cancelQueries({ queryKey: ['post'] });

      return { previousFollowing: !shouldUnfollow };
    },
    onSuccess: () => {
      // Sync all relevant data clusters
      queryClient.invalidateQueries({ queryKey: ['profile'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['posts'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['post'], refetchType: 'all' });
      queryClient.invalidateQueries({ queryKey: ['following-users'], refetchType: 'all' });
      
      if (onToggle) onToggle();
    },
    onError: (err, variables, context) => {
      // Rollback on error
      setOptimisticFollowing(context.previousFollowing);
    }
  });

  const handleAction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    mutation.mutate(optimisticFollowing);
  };

  const displayFollowing = optimisticFollowing;

  return (
    <motion.button
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      disabled={mutation.isPending}
      onClick={handleAction}
      className={cn(
        'text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-all flex items-center gap-1 min-w-[80px] justify-center',
        displayFollowing 
          ? (isHovered ? 'text-rose-500 bg-rose-50 border border-rose-200' : 'text-[var(--ink-faint)] bg-transparent border border-[var(--line)]') 
          : 'text-white bg-[var(--accent)] shadow-sm'
      )}
      initial={false}
      animate={{
        backgroundColor: displayFollowing ? (isHovered ? 'rgba(255, 241, 242, 1)' : 'rgba(0,0,0,0)') : 'var(--accent)',
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <motion.span
        layout
        key={displayFollowing ? (isHovered ? 'unfollow' : 'following') : 'follow'}
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -2 }}
        transition={{ duration: 0.15 }}
      >
        {displayFollowing ? (isHovered ? 'Unfollow' : 'Following') : 'Follow'}
      </motion.span>
    </motion.button>
  );
}
