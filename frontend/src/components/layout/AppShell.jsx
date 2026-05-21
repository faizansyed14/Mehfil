import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomBar from './BottomBar';

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
            className={isAdminPage ? "mx-auto px-4 py-8 md:px-8 max-w-7xl w-full" : "mx-auto px-4 py-6 md:px-6 lg:px-8"}
            style={isAdminPage ? {} : { maxWidth: 680 }}
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
