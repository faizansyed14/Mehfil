import { Menu } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

export default function TopBar() {
  const { toggleSidebar } = useUiStore();

  return (
    <header
      className="sticky top-0 z-30 flex items-center px-4 h-14 border-b md:hidden"
      style={{
        backgroundColor: 'var(--bg-elev)',
        borderColor: 'var(--line)',
      }}
    >
      <button
        onClick={toggleSidebar}
        className="p-2 -ml-2 rounded-md transition-colors hover:bg-[var(--accent-soft)]"
        aria-label="Toggle menu"
      >
        <Menu size={20} strokeWidth={1.5} style={{ color: 'var(--ink)' }} />
      </button>
      <span
        className="ml-3 font-display"
        style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: 'var(--ink)',
        }}
      >
        Mehfil
      </span>
    </header>
  );
}
