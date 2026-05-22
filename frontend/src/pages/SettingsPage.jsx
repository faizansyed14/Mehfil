import { motion } from 'framer-motion';
import { useUiStore } from '../store/uiStore';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function SettingsPage() {
  const { theme } = useUiStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
    >
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--ink)] mb-6">
        Settings
      </h1>

      <div className="surface-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink)' }}>
              Appearance
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
              Switch between light and dark mode
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--ink-muted)] capitalize">{theme} mode</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
