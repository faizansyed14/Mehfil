import { Menu } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import ThemeToggle from '../ui/ThemeToggle';

export default function TopBar() {
  const { toggleSidebar } = useUiStore();

  return (
    <header className="surface-glass sticky top-0 z-30 flex items-center justify-between gap-2 px-3 sm:px-4 h-14 md:hidden pt-[var(--safe-top)]">
      <div className="flex items-center min-w-0">
        <button
          onClick={toggleSidebar}
          className="p-2.5 -ml-1 rounded-[var(--radius)] transition-colors hover:bg-[var(--accent-soft)] min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
          aria-label="Toggle menu"
        >
          <Menu size={20} strokeWidth={1.5} className="text-[var(--ink)]" />
        </button>
        <span className="ml-2 font-display text-lg font-semibold text-[var(--ink)] truncate">
          Mehfil
        </span>
      </div>

      <ThemeToggle className="shrink-0" />
    </header>
  );
}
