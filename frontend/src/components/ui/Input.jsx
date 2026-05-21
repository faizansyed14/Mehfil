import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Input = forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold mb-1.5 text-[var(--ink-muted)] uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full bg-[var(--bg-elev)] border border-[var(--line)] rounded-md px-3 py-2 text-sm transition-colors focus:border-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]',
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
