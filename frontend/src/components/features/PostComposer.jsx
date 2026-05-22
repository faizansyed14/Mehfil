import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../../api/posts.api';
import { Button } from '../ui/Button';

export default function PostComposer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const textareaRef = useRef(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postsApi.create,
    onSuccess: () => {
      setTitle('');
      setBody('');
      setTags('');
      setIsExpanded(false);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!body.trim()) return;

    mutation.mutate({
      title: title.trim() || null,
      body,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
  };

  const inputClass =
    'w-full min-w-0 bg-transparent outline-none placeholder:text-[var(--ink-faint)] text-base md:text-lg';

  return (
    <div className="surface-card mb-6 sm:mb-8 p-4 sm:p-5 min-w-0">
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="flex w-full flex-col gap-1 cursor-text py-2 text-left min-h-[52px]"
        >
          <span className="text-lg sm:text-xl font-bold font-display text-[var(--ink-faint)] italic opacity-60">
            Untitled Verse...
          </span>
          <span className="text-sm text-[var(--ink-faint)]">
            Write your poetry here...
          </span>
        </button>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4 min-w-0"
        >
          <input
            type="text"
            placeholder="Title of your verse (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${inputClass} font-display text-xl sm:text-2xl font-bold border-b border-[var(--line)] pb-2 focus:border-[var(--accent)]`}
          />

          <textarea
            ref={textareaRef}
            placeholder="Your poem..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className={`${inputClass} font-display leading-relaxed resize-y min-h-[140px]`}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-[var(--line)]">
            <input
              type="text"
              placeholder="tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={`${inputClass} text-base sm:text-sm text-[var(--ink-muted)]`}
            />

            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
              <span className="text-[10px] uppercase tracking-tighter text-[var(--ink-faint)] order-first sm:order-none w-full sm:w-auto text-right sm:text-left">
                {body.length} / 4000
              </span>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setIsExpanded(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                type="submit"
                isLoading={mutation.isPending}
                disabled={!body.trim()}
              >
                Publish
              </Button>
            </div>
          </div>
        </motion.form>
      )}
    </div>
  );
}
