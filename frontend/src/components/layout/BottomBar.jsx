import { NavLink } from 'react-router-dom';
import { Compass, Users, NotebookPen, User, Settings } from 'lucide-react';

const items = [
  { to: '/', icon: Compass, label: 'Home' },
  { to: '/following', icon: Users, label: 'Following' },
  { to: '/my-posts', icon: NotebookPen, label: 'Posts' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function BottomBar() {
  return (
    <nav
      className="surface-glass md:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-[var(--line)] py-1.5 px-1"
      style={{ paddingBottom: 'max(0.5rem, var(--safe-bottom))' }}
    >
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[48px] px-1 py-1 rounded-[var(--radius)] ${
              isActive ? 'text-[var(--accent)]' : 'text-[var(--ink-faint)]'
            }`
          }
        >
          <Icon size={20} strokeWidth={1.5} />
          <span className="text-[10px] font-medium leading-none">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
