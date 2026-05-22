import { MessageSquare, MoreHorizontal, Copy, Flag, Trash } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { InitialsAvatar } from '../layout/Sidebar';
import { relativeTime } from '../../lib/format';
import ReactionBar from './ReactionBar';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../../api/posts.api';
import FollowButton from './FollowButton';

export default function PostCard({ post }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthor = user?.id === post.authorId;

  const deleteMutation = useMutation({
    mutationFn: () => postsApi.delete(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      if (location.pathname.startsWith('/post/')) {
        navigate('/');
      }
    },
  });

  const handleDelete = () => {
    if (window.confirm('Delete this poem for ever?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="surface-card p-4 sm:p-6 space-y-4 min-w-0"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between min-w-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Link
            to={`/u/${post.author.username}`}
            className="inline-flex items-center gap-2.5 sm:gap-3 min-w-0 group"
          >
            <InitialsAvatar name={post.author.displayName} size={36} />
            <div className="leading-tight min-w-0">
              <p className="text-sm font-semibold text-[var(--ink)] group-hover:underline truncate">
                {post.author.displayName}
              </p>
              <p className="text-xs text-[var(--ink-muted)] truncate">
                @{post.author.username} · {relativeTime(post.createdAt)}
              </p>
            </div>
          </Link>

          <FollowButton
            username={post.author.username}
            isFollowing={post.author.isFollowing}
          />
        </div>

        <div className="relative self-end sm:self-start shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2.5 rounded-full hover:bg-[var(--accent-soft)] transition-colors text-[var(--ink-faint)] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Post options"
          >
            <MoreHorizontal size={18} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-44 max-w-[calc(100vw-2rem)] rounded-lg border surface-card z-10 py-1 overflow-hidden shadow-lg">
              <button className="w-full text-left px-3 py-2.5 text-xs hover:bg-[var(--accent-soft)] flex items-center gap-2 min-h-[40px]">
                <Copy size={14} /> Copy link
              </button>
              <button className="w-full text-left px-3 py-2.5 text-xs hover:bg-[var(--accent-soft)] flex items-center gap-2 min-h-[40px]">
                <Flag size={14} /> Report
              </button>
              {(isAuthor || user?.role === 'ADMIN') && (
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-3 py-2.5 text-xs hover:bg-[var(--accent-soft)] text-[var(--accent)] flex items-center gap-2 border-t border-[var(--line)] min-h-[40px]"
                >
                  <Trash size={14} /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Link to={`/post/${post.id}`} className="block space-y-2 min-w-0">
        {post.title && (
          <h2 className="font-display text-lg sm:text-xl font-semibold text-[var(--ink)] break-words">
            {post.title}
          </h2>
        )}
        <div className="poem-body text-[var(--ink)] text-base sm:text-lg leading-relaxed">
          {post.body}
        </div>
      </Link>

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-wider text-[var(--ink-muted)] hover:text-[var(--accent)]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)]">
        <ReactionBar postId={post.id} />

        <Link
          to={`/post/${post.id}`}
          className="flex items-center gap-1.5 text-xs text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors min-h-[40px] px-1"
        >
          <MessageSquare size={16} strokeWidth={1.5} />
          {post._count?.comments > 0 && post._count.comments}
        </Link>
      </div>
    </motion.article>
  );
}
