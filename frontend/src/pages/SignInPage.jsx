import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import ThemeToggle from '../components/ui/ThemeToggle';

const schema = z.object({
  identifier: z.string().min(3, 'Username or email required'),
  password: z.string().min(1, 'Password required'),
});

export default function SignInPage() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const response = await authApi.signin(data);
      setAuth(response.user, response.accessToken);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.error?.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-dvh flex items-center justify-center px-4 py-8"
    >
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10" style={{ paddingTop: 'var(--safe-top)' }}>
        <ThemeToggle />
      </div>
      <div className="w-full max-w-[400px] min-w-0">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--ink)] mb-2">
            Mehfil
          </h1>
          <p className="font-body text-sm italic text-[var(--ink-muted)]">
            a gathering for verse
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 sm:space-y-6 surface-card p-5 sm:p-8"
        >
          {serverError && (
            <div className="p-3 text-xs font-medium text-[var(--accent)] bg-[var(--accent-soft)] rounded-md border border-[var(--line)]">
              {serverError}
            </div>
          )}

          <Input
            label="Email or Username"
            placeholder="e.g. admin@gmail.com"
            autoComplete="username"
            error={errors.identifier?.message}
            {...register('identifier')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <p className="mt-6 sm:mt-8 text-center text-sm text-[var(--ink-muted)]">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-[var(--accent)] font-medium hover:underline">
            Join the gathering
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
