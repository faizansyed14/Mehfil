import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../../api/posts.api';
import { Button } from '../ui/Button';
import { InitialsAvatar } from '../layout/Sidebar';
import { relativeTime } from '../../lib/format';
import { Trash } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function CommentThread({ postId }) {
  const [commentBody, setCommentBody] = useState('');
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => postsApi.getComments(postId),
  });

  const createMutation = useMutation({
    mutationFn: (body) => postsApi.createComment(postId, body),
    onSuccess: () => {
      setCommentBody('');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId) => postsApi.deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  if (isLoading) return <div className="py-4 text-center text-xs text-[var(--ink-faint)]">Loading comments…</div>;

  return (
    <div className="space-y-6 pt-6">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
        Comments ({comments?.length || 0})
      </h3>

      {/* Comment Input */}
      {user && (
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (commentBody.trim()) createMutation.mutate(commentBody);
          }}
          className="flex gap-3"
        >
          <InitialsAvatar name={user.displayName} size={28} />
          <div className="flex-1 space-y-2">
            <textarea
              placeholder="Add your thoughts…"
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              className="w-full min-w-0 bg-transparent border-b border-[var(--line)] py-2 text-base outline-none focus:border-[var(--accent)] resize-none transition-colors"
              rows={2}
            />
            <div className="flex justify-end">
              <Button 
                size="sm" 
                variant="primary" 
                disabled={!commentBody.trim()}
                isLoading={createMutation.isPending}
              >
                Post
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <InitialsAvatar name={comment.author.displayName} size={28} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--ink)]">
                    {comment.author.displayName}
                  </span>
                  <span className="text-[10px] text-[var(--ink-faint)]">
                    {relativeTime(comment.createdAt)}
                  </span>
                </div>
                
                {(user?.id === comment.authorId || user?.role === 'ADMIN') && (
                  <button 
                    onClick={() => deleteMutation.mutate(comment.id)}
                    className="text-[var(--ink-faint)] hover:text-[var(--accent)] transition-colors p-1"
                  >
                    <Trash size={12} />
                  </button>
                )}
              </div>
              <p className="text-sm text-[var(--ink-muted)] mt-1 whitespace-pre-wrap">
                {comment.body}
              </p>
            </div>
          </div>
        ))}

        {comments?.length === 0 && (
          <p className="text-center py-4 text-xs text-[var(--ink-faint)] italic">
            Be the first to comment on this verse.
          </p>
        )}
      </div>
    </div>
  );
}
