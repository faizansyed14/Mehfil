import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
      className="min-h-[60vh] flex flex-col items-center justify-center text-center"
    >
      <h1
        className="font-display mb-2"
        style={{ fontSize: '3rem', fontWeight: 600, color: 'var(--ink)' }}
      >
        404
      </h1>
      <p
        className="mb-6"
        style={{ fontSize: '0.875rem', color: 'var(--ink-muted)' }}
      >
        This page does not exist.
      </p>
      <Link
        to="/"
        className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
        style={{
          backgroundColor: 'var(--accent)',
          color: '#fff',
        }}
      >
        Return home
      </Link>
    </motion.div>
  );
}
