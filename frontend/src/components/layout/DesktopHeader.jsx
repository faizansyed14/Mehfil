import ThemeToggle from '../ui/ThemeToggle';

export default function DesktopHeader() {
  return (
    <header className="hidden md:flex sticky top-0 z-20 justify-end items-center px-6 pt-5 pb-1 pointer-events-none">
      <div className="pointer-events-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
