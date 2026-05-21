import { Check, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UsernameAvailability({ availability, isLoading, onSelectSuggestion }) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 mt-2 text-xs text-[var(--ink-faint)]">
        <Loader2 size={12} className="animate-spin" />
        Checking availability…
      </div>
    );
  }

  if (!availability) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={availability.available ? 'available' : 'taken'}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        className="mt-2"
      >
        {availability.available ? (
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
            <Check size={12} />
            Available
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--accent)] font-medium mb-2">
              <X size={12} />
              Taken — try one of these:
            </div>
            <div className="flex flex-wrap gap-2">
              {availability.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSelectSuggestion(s)}
                  className="px-2 py-1 rounded-md border border-[var(--line)] text-xs bg-[var(--bg-elev)] hover:bg-[var(--accent-soft)] transition-colors"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
