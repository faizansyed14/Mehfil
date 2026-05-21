import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import axios from 'axios';
import AppRoutes from './routes/AppRoutes';
import { useUiStore } from './store/uiStore';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ThemeInit() {
  const { theme } = useUiStore();
  const { setAuth, setLoading, clearAuth } = useAuthStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    async function initAuth() {
      try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/auth/refresh`, {}, { withCredentials: true });
        setAuth(data.user, data.accessToken);
      } catch (err) {
        clearAuth();
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, [setAuth, setLoading, clearAuth]);

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeInit />
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
