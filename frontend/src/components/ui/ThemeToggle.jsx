import { Moon, Sun } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { cn } from '../../lib/cn';

export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useUiStore();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Dark mode' : 'Light mode'}
      className={cn(
        'flex items-center justify-center rounded-full border border-[var(--line)]',
        'bg-[var(--bg-elev)] text-[var(--ink-muted)] hover:text-[var(--ink)]',
        'hover:bg-[var(--accent-soft)] transition-colors min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px]',
        className
      )}
    >
      {isLight ? (
        <Moon size={18} strokeWidth={1.5} />
      ) : (
        <Sun size={18} strokeWidth={1.5} />
      )}
    </button>
  );
}
