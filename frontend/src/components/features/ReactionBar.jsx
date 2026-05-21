import { Heart, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../../api/posts.api';
import { cn } from '../../lib/cn';

const REACTION_TYPES = [
  { type: 'RESONATE', icon: Heart, label: 'Resonate' },
  { type: 'MOVED', icon: Flame, label: 'Moved' },
];

export default function ReactionBar({ postId }) {
  const queryClient = useQueryClient();

  const { data: summary } = useQuery({
    queryKey: ['reactions', postId],
    queryFn: () => postsApi.getSummary(postId),
  });

  const mutation = useMutation({
    mutationFn: ({ type }) => postsApi.toggleReaction(postId, type),
    onMutate: async ({ type }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['reactions', postId] });
      const previous = queryClient.getQueryData(['reactions', postId]);
      
      if (previous) {
        const isReacted = previous.mine.includes(type);
        queryClient.setQueryData(['reactions', postId], {
          ...previous,
          [type]: isReacted ? previous[type] - 1 : previous[type] + 1,
          mine: isReacted 
            ? previous.mine.filter(t => t !== type) 
            : [...previous.mine, type]
        });
      }
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['reactions', postId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reactions', postId] });
    },
  });

  if (!summary) return <div className="h-8 animate-pulse bg-[var(--line)] rounded-full w-48" />;

  return (
    <div className="flex items-center gap-6 py-2">
      {REACTION_TYPES.map(({ type, icon: Icon }) => {
        const isActive = summary.mine.includes(type);
        const count = summary[type];

        return (
          <button
            key={type}
            onClick={() => mutation.mutate({ type })}
            className="group flex items-center gap-1.5 transition-colors outline-none"
          >
            <motion.div
              animate={isActive ? { scale: [1, 1.3, 1], rotate: type === 'MOVED' ? [0, -10, 10, 0] : 0 } : {}}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 10,
                duration: 0.3
              }}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2 : 1.5}
                className={cn(
                  'transition-all duration-300',
                  isActive 
                    ? (type === 'RESONATE' ? 'text-rose-500 fill-rose-500' : 'text-orange-500 fill-orange-500 shadow-orange-200 drop-shadow-sm')
                    : 'text-[var(--ink-faint)] group-hover:text-[var(--ink)]'
                )}
              />
            </motion.div>
            {count > 0 && (
                <span className={cn(
                    'text-xs font-medium',
                    isActive ? 'text-[var(--accent)]' : 'text-[var(--ink-faint)]'
                )}>
                    {count}
                </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
