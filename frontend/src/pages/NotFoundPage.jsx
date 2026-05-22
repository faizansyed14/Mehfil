import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-dvh flex flex-col items-center justify-center text-center px-4"
    >
      <h1 className="font-display text-5xl sm:text-6xl font-semibold text-[var(--ink)] mb-2">
        404
      </h1>
      <p className="mb-6 text-sm text-[var(--ink-muted)]">
        This page does not exist.
      </p>
      <Link to="/" className="bg-[var(--accent)] text-white px-6 py-3 rounded-[var(--radius)] text-sm font-medium shadow-md hover:opacity-90">
        Return home
      </Link>
    </motion.div>
  );
}
