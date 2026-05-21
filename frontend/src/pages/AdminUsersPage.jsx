import { motion } from 'framer-motion';

export default function AdminUsersPage() {
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
        Admin
      </h1>
      <p style={{ fontSize: '0.875rem', color: 'var(--ink-faint)' }}>
        Admin panel coming in Phase 5
      </p>
    </motion.div>
  );
}
