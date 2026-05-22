import { NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  Users,
  NotebookPen,
  User,
  Settings,
  ShieldCheck,
  Search,
  LogOut,
  ChevronUp,
  Menu,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';
import { cn } from '../../lib/cn';
import { useState } from 'react';

const navItems = [
  { to: '/', label: 'Home', icon: Compass },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/following', label: 'Following', icon: Users },
  { to: '/my-posts', label: 'My Posts', icon: NotebookPen },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function InitialsAvatar({ name, size = 32 }) {
  const initials = (name || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: 'var(--accent-soft)',
        color: 'var(--ink)',
        fontSize: size * 0.4,
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
      }}
    >
      {initials}
    </div>
  );
}

export default function Sidebar() {
  const { user, clearAuth } = useAuthStore();
  const { sidebarOpen, closeSidebar } = useUiStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearAuth();
    navigate('/signin');
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          'surface-glass fixed top-0 left-0 z-50 h-full flex flex-col border-r transition-transform duration-200 md:translate-x-0 md:static md:z-auto w-[min(85vw,260px)] md:w-[240px]',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ paddingTop: 'var(--safe-top)' }}
      >
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4">
          <h1 className="font-display text-xl font-semibold text-[var(--ink)] tracking-tight">
            Mehfil
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors',
                  'hover:bg-[var(--accent-soft)]'
                )
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--ink)' : 'var(--ink-muted)',
                fontWeight: isActive ? 600 : 400,
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                marginLeft: -2,
              })}
            >
              <Icon size={18} strokeWidth={1.5} />
              <span>{label}</span>
            </NavLink>
          ))}

          {/* Admin — only for admins */}
          {user?.role === 'ADMIN' && (
            <>
              <div
                className="mx-3 my-3"
                style={{ height: 1, backgroundColor: 'var(--line)' }}
              />
              <NavLink
                to="/admin"
                onClick={closeSidebar}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors hover:bg-[var(--accent-soft)]"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--ink)' : 'var(--ink-muted)',
                  fontWeight: isActive ? 600 : 400,
                  borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  marginLeft: -2,
                })}
              >
                <ShieldCheck size={18} strokeWidth={1.5} />
                <span>Admin</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Attribution */}
        <div className="px-6 py-2 text-[9px] uppercase tracking-[0.2em] text-[var(--ink-faint)] font-medium opacity-60">
          Mehfil
        </div>

        {/* User pill */}
        {user && (
          <div className="relative px-3 pb-4">
            {userMenuOpen && (
              <div
                className="absolute bottom-full left-3 right-3 mb-1 rounded-lg border py-1"
                style={{
                  backgroundColor: 'var(--bg-elev)',
                  borderColor: 'var(--line)',
                  boxShadow: 'var(--shadow-dropdown)',
                }}
              >
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors hover:bg-[var(--accent-soft)]"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  <LogOut size={16} strokeWidth={1.5} />
                  Sign out
                </button>
              </div>
            )}
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors hover:bg-[var(--accent-soft)]"
              style={{ border: '1px solid var(--line)' }}
            >
              <InitialsAvatar name={user.displayName} size={28} />
              <span
                className="flex-1 text-left text-sm truncate"
                style={{ color: 'var(--ink)' }}
              >
                {user.displayName}
              </span>
              <ChevronUp
                size={16}
                strokeWidth={1.5}
                className={cn(
                  'transition-transform',
                  userMenuOpen ? 'rotate-0' : 'rotate-180'
                )}
                style={{ color: 'var(--ink-faint)' }}
              />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export { InitialsAvatar };
