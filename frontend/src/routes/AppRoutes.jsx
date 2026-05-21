import { Routes, Route } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import HomePage from '../pages/HomePage';
import FollowingFeedPage from '../pages/FollowingFeedPage';
import MyPostsPage from '../pages/MyPostsPage';
import PostDetailPage from '../pages/PostDetailPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import SearchPage from '../pages/SearchPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected routes inside AppShell */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<HomePage />} />
        <Route path="following" element={<FollowingFeedPage />} />
        <Route path="my-posts" element={<MyPostsPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="post/:id" element={<PostDetailPage />} />
        <Route path="u/:username" element={<ProfilePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* Admin Routes */}
        <Route path="admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
