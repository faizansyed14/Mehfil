import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import DesktopHeader from './DesktopHeader';
import BottomBar from './BottomBar';
import { cn } from '../../lib/cn';

export default function AppShell() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex min-h-dvh max-h-dvh md:max-h-none w-full overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopBar />
        <DesktopHeader />

        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full overscroll-y-contain">
          <div
            className={cn(
              'mx-auto w-full min-w-0 pt-4 sm:pt-6 px-3 sm:px-4 md:px-6 pb-nav-safe',
              isAdminPage ? 'max-w-7xl' : 'max-w-[680px]'
            )}
          >
            <Outlet />
          </div>
        </main>

        <BottomBar />
      </div>
    </div>
  );
}
