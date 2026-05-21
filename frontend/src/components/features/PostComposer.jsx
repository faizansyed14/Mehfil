import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../../api/posts.api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

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
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="mb-8 p-4 rounded-lg border border-[var(--line)] bg-[var(--bg-elev)]">
      {!isExpanded ? (
        <div
          onClick={() => setIsExpanded(true)}
          className="flex flex-col gap-1 cursor-text py-1 group"
        >
          <span className="text-xl font-bold font-display text-[var(--ink-faint)] group-hover:text-[var(--ink-muted)] transition-colors italic opacity-50">
            Untitled Verse...
          </span>
          <span className="text-sm text-[var(--ink-faint)]">
            Write your poetry here...
          </span>
        </div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="relative group">
            <input
              type="text"
              placeholder="Title of your verse (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full font-display text-2xl font-bold bg-transparent outline-none border-b border-transparent focus:border-[var(--accent-soft)] pb-2 transition-all placeholder:text-[var(--ink-faint)] placeholder:italic"
            />
          </div>
          
          <textarea
            ref={textareaRef}
            placeholder="Your poem..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="w-full font-display text-lg bg-transparent outline-none border-none resize-none placeholder:text-[var(--ink-faint)] leading-relaxed"
          />

          <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between pt-2 border-t border-[var(--line)]">
            <input
              type="text"
              placeholder="tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="flex-1 text-xs text-[var(--ink-muted)] bg-transparent outline-none placeholder:text-[var(--ink-faint)]"
            />
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-tighter text-[var(--ink-faint)]">
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
