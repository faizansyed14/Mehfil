import { motion } from 'framer-motion';
import { useUiStore } from '../store/uiStore';
import { Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useUiStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
    >
      <h1
        className="font-display mb-6"
        style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--ink)' }}
      >
        Settings
      </h1>

      <div
        className="rounded-lg border p-6"
        style={{
          borderColor: 'var(--line)',
          backgroundColor: 'var(--bg-elev)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink)' }}>
              Appearance
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
              Switch between light and dark mode
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded-md border transition-colors hover:bg-[var(--accent-soft)]"
            style={{
              borderColor: 'var(--line)',
              color: 'var(--ink-muted)',
              fontSize: '0.875rem',
            }}
          >
            {theme === 'light' ? (
              <>
                <Moon size={16} strokeWidth={1.5} />
                Dark
              </>
            ) : (
              <>
                <Sun size={16} strokeWidth={1.5} />
                Light
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
