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
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-semibold mb-2" style={{ color: 'var(--ink)' }}>
            Mehfil
          </h1>
          <p className="font-body text-sm italic" style={{ color: 'var(--ink-muted)' }}>
            a gathering for verse
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-[var(--bg-elev)] p-8 border border-[var(--line)] rounded-lg">
          {serverError && (
            <div className="p-3 text-xs font-medium text-[var(--accent)] bg-[var(--accent-soft)] rounded-md border border-[var(--accent)] border-opacity-20">
              {serverError}
            </div>
          )}

          <Input
            label="Email or Username"
            placeholder="e.g. poet@mehfil.local"
            error={errors.identifier?.message}
            {...register('identifier')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <p className="mt-8 text-center text-sm" style={{ color: 'var(--ink-muted)' }}>
          Don't have an account?{' '}
          <Link to="/signup" className="text-[var(--accent)] font-medium hover:underline">
            Join the gathering
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
