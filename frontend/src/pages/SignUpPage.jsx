import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import UsernameAvailability from '../components/features/UsernameAvailability';
import { authApi } from '../api/auth.api';
import { usersApi } from '../api/users.api';
import { useAuthStore } from '../store/authStore';
import { useDebounce } from '../hooks/useDebounce';
import ThemeToggle from '../components/ui/ThemeToggle';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string()
    .min(3, 'At least 3 characters')
    .max(20, 'At most 20 characters')
    .regex(/^[a-z0-9_]+$/, 'Alphanumeric and underscores only'),
  displayName: z.string().min(1, 'Display name required'),
  password: z.string().min(8, 'At least 8 characters'),
});

export default function SignUpPage() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const username = watch('username');
  const debouncedUsername = useDebounce(username, 350);

  useEffect(() => {
    async function check() {
      if (!debouncedUsername || debouncedUsername.length < 3) {
        setUsernameStatus(null);
        return;
      }
      setIsCheckingUsername(true);
      try {
        const result = await usersApi.checkUsername(debouncedUsername);
        setUsernameStatus(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsCheckingUsername(false);
      }
    }
    check();
  }, [debouncedUsername]);

  const onSubmit = async (data) => {
    if (usernameStatus && !usernameStatus.available) {
      setServerError('Please choose an available username');
      return;
    }
    setIsLoading(true);
    setServerError(null);
    try {
      const response = await authApi.signup(data);
      setAuth(response.user, response.accessToken);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.error?.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-dvh py-8 sm:py-16 flex items-center justify-center px-4"
    >
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10" style={{ paddingTop: 'var(--safe-top)' }}>
        <ThemeToggle />
      </div>
      <div className="w-full max-w-[440px] min-w-0">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--ink)] mb-2">
            Join Mehfil
          </h1>
          <p className="font-body text-sm text-[var(--ink-muted)]">
            Become part of the verse
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

          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <Input
                label="Username"
                placeholder="poet_scribe"
                autoComplete="username"
                error={errors.username?.message}
                {...register('username')}
              />
              <UsernameAvailability
                isLoading={isCheckingUsername}
                availability={usernameStatus}
                onSelectSuggestion={(s) => {
                  setValue('username', s);
                  setUsernameStatus({ available: true, suggestions: [] });
                }}
              />
            </div>

            <Input
              label="Display Name"
              placeholder="e.g. Your Name"
              autoComplete="name"
              error={errors.displayName?.message}
              {...register('displayName')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <p className="mt-6 sm:mt-8 text-center text-sm text-[var(--ink-muted)]">
          Already signed up?{' '}
          <Link to="/signin" className="text-[var(--accent)] font-medium hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
