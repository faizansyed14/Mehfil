import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Input = forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full min-w-0">
      {label && (
        <label className="block text-xs font-semibold mb-1.5 text-[var(--ink-muted)] uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full min-w-0 surface-card rounded-[var(--radius)] px-3 py-2.5 text-base md:text-sm text-sm-input transition-colors',
          'focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] outline-none',
          'placeholder:text-[var(--ink-faint)]',
          error && 'border-[var(--accent)]',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-[var(--accent)] font-medium">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export { Input };
