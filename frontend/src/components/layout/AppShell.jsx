import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import { cn } from '../../lib/cn';

export default function AppShell() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <TopBar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto w-full">
          <div
            className={cn(
              "mx-auto pt-6 px-4 md:px-6",
              isAdminPage ? "w-full max-w-7xl" : "w-full max-w-[680px]"
            )}
          >
            <Outlet />
          </div>
        </main>

        {/* Mobile bottom bar */}
        <BottomBar />
      </div>
    </div>
  );
}
