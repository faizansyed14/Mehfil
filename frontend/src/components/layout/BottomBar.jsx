import { NavLink } from 'react-router-dom';
import { Compass, Users, NotebookPen, User, Settings } from 'lucide-react';
import { cn } from '../../lib/cn';

const items = [
  { to: '/', icon: Compass, label: 'Home' },
  { to: '/following', icon: Users, label: 'Following' },
  { to: '/my-posts', icon: NotebookPen, label: 'My Posts' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function BottomBar() {
  return (
    <nav
      className="md:hidden flex items-center justify-around border-t py-2"
      style={{
        backgroundColor: 'var(--bg-elev)',
        borderColor: 'var(--line)',
      }}
    >
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className="flex flex-col items-center gap-0.5 px-2 py-1"
          style={({ isActive }) => ({
            color: isActive ? 'var(--accent)' : 'var(--ink-faint)',
          })}
        >
          <Icon size={20} strokeWidth={1.5} />
          <span style={{ fontSize: '0.625rem', fontWeight: 500 }}>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
