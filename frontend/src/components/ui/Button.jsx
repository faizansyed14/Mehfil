import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Button = forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
  const variants = {
    primary: 'bg-[var(--accent)] text-white hover:opacity-90',
    secondary: 'surface-card text-[var(--ink)] hover:bg-white/90',
    ghost: 'text-[var(--ink-muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--ink)]',
    outline: 'border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-soft)]',
  };

  const sizes = {
    sm: 'px-3 py-2 text-xs min-h-[36px]',
    md: 'px-4 py-2.5 text-sm min-h-[40px]',
    lg: 'px-6 py-3 text-base min-h-[44px]',
  };

  return (
    <button
      ref={ref}
      disabled={isLoading || props.disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-[var(--radius)] font-medium transition-all',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export { Button };
