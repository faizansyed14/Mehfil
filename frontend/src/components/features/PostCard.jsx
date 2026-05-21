import { MessageSquare, MoreHorizontal, Copy, Flag, Trash } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { InitialsAvatar } from '../layout/Sidebar';
import { relativeTime } from '../../lib/format';
import ReactionBar from './ReactionBar';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';
import { cn } from '../../lib/cn';
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
      className="p-6 rounded-2xl border border-[var(--line)] bg-[var(--bg-elev)] space-y-4"
    >
      {/* Author Line */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/u/${post.author.username}`} className="inline-flex items-center gap-3 group">
            <InitialsAvatar name={post.author.displayName} size={32} />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-[var(--ink)] group-hover:underline">
                {post.author.displayName}
              </p>
              <p className="text-xs text-[var(--ink-muted)]">
                @{post.author.username} · {relativeTime(post.createdAt)}
              </p>
            </div>
          </Link>
          
          <FollowButton 
            username={post.author.username} 
            isFollowing={post.author.isFollowing} 
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-[var(--accent-soft)] transition-colors text-[var(--ink-faint)]"
          >
            <MoreHorizontal size={18} />
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-40 rounded-lg border bg-[var(--bg-elev)] border-[var(--line)] shadow-lg z-10 py-1 overflow-hidden">
              <button className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--accent-soft)] flex items-center gap-2">
                <Copy size={14} /> Copy link
              </button>
              <button className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--accent-soft)] flex items-center gap-2">
                <Flag size={14} /> Report
              </button>
              {(isAuthor || user?.role === 'ADMIN') && (
                <button 
                  onClick={handleDelete}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--accent-soft)] text-[var(--accent)] flex items-center gap-2 border-t border-[var(--line)]"
                >
                  <Trash size={14} /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <Link to={`/post/${post.id}`} className="block space-y-2">
        {post.title && (
          <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
            {post.title}
          </h2>
        )}
        <div className="poem-body text-[var(--ink)] text-lg leading-relaxed">
          {post.body}
        </div>
      </Link>

      {/* Footer Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {post.tags.map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider text-[var(--ink-muted)] hover:text-[var(--accent)] cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Interactions */}
      <div className="pt-2 flex items-center justify-between border-t border-[var(--line)]">
        <ReactionBar postId={post.id} />
        
        <Link 
          to={`/post/${post.id}`} 
          className="flex items-center gap-1.5 text-xs text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors"
        >
          <MessageSquare size={16} strokeWidth={1.5} />
          {post._count?.comments > 0 && post._count.comments}
        </Link>
      </div>
    </motion.article>
  );
}
