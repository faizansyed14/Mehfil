import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import { postsApi } from '../api/posts.api';
import { 
  Loader2, Users, FileText, MessageSquare, Heart, 
  ArrowUpRight, Trash, Edit, Shield, MoreVertical,
  Search, Filter
} from 'lucide-react';
import { InitialsAvatar } from '../components/layout/Sidebar';
import { relativeTime } from '../lib/format';
import { cn } from '../lib/cn';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getDashboard,
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getUsers({ limit: 20 }),
    enabled: activeTab === 'users',
  });

  // Reusing postsApi for the post management tab
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: () => postsApi.getPosts({ limit: 20 }),
    enabled: activeTab === 'posts',
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => adminApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (id) => postsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const handleToggleRole = (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (window.confirm(`Change ${user.username}'s role to ${newRole}?`)) {
      updateUserMutation.mutate({ id: user.id, data: { role: newRole } });
    }
  };

  const handleDeleteUser = (id, isAdmin) => {
    if (isAdmin) return alert('Cannot delete an admin.');
    if (window.confirm('Are you absolutely sure you want to banish this poet and all their verses?')) {
      deleteUserMutation.mutate(id);
    }
  };

  const handleDeletePost = (id) => {
    if (window.confirm('Delete this verse forever?')) {
      deletePostMutation.mutate(id);
    }
  };

  if (statsLoading) return (
    <div className="flex justify-center py-24">
      <Loader2 className="animate-spin text-[var(--ink-faint)]" />
    </div>
  );

  const statCards = [
    { label: 'Total Poets', value: stats.counts.users, icon: Users, color: 'text-blue-500' },
    { label: 'Total Verses', value: stats.counts.posts, icon: FileText, color: 'text-emerald-500' },
    { label: 'Total Comments', value: stats.counts.comments, icon: MessageSquare, color: 'text-amber-500' },
    { label: 'Total Reactions', value: stats.counts.reactions, icon: Heart, color: 'text-rose-500' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ArrowUpRight },
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'posts', label: 'Manage Posts', icon: FileText },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-12"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--ink)]">Control Room</h1>
          <p className="text-sm text-[var(--ink-muted)]">Maintain the balance of Mehfil.</p>
        </div>
        
        <div className="flex gap-1 bg-[var(--accent-soft)] p-1 rounded-xl">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                activeTab === t.id 
                  ? "bg-white text-[var(--accent)] shadow-sm" 
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              )}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="space-y-10"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((s) => (
                <div key={s.label} className="p-6 bg-[var(--bg-elev)] border border-[var(--line)] rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-2 rounded-lg bg-opacity-10", s.color.replace('text', 'bg'))}>
                      <s.icon size={20} className={s.color} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[var(--ink)]">{s.value}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--ink-faint)] mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity Mini-List */}
            <div className="grid grid-cols-1 gap-8">
              <section className="bg-[var(--bg-elev)] border border-[var(--line)] rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[var(--line)]">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--ink-muted)]">Latest Gatherers (15 Recent)</h2>
                </div>
                <div className="divide-y divide-[var(--line)] max-h-[500px] overflow-y-auto custom-scrollbar">
                  {stats.recentUsers.map((u) => (
                    <div key={u.id} className="p-4 flex items-center justify-between hover:bg-[var(--accent-soft)] transition-colors group">
                      <div className="flex items-center gap-3">
                        <InitialsAvatar name={u.displayName} size={36} />
                        <div>
                          <p className="text-sm font-semibold text-[var(--ink)]">{u.displayName}</p>
                          <p className="text-xs text-[var(--ink-muted)]">@{u.username}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-[var(--ink-faint)]">{relativeTime(u.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="flex flex-col justify-center items-center p-12 bg-indigo-50 bg-opacity-30 rounded-2xl border border-indigo-100 border-dashed">
                 <Shield size={48} className="text-indigo-300 mb-4" />
                 <p className="text-sm text-indigo-900 font-medium text-center max-w-xs">
                   Use the tabs above to manage users and modify data across the platform.
                 </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--bg-elev)] border border-[var(--line)] rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b border-[var(--line)] flex items-center justify-between flex-wrap gap-4">
               <h3 className="font-bold text-lg">User Registry</h3>
               <div className="flex gap-2">
                 <div className="relative">
                   <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]" />
                   <input 
                     placeholder="Search users..." 
                     className="pl-9 pr-4 py-2 bg-white border border-[var(--line)] rounded-lg text-xs outline-none focus:ring-1 focus:ring-[var(--accent)]" 
                   />
                 </div>
               </div>
            </div>
            {usersLoading ? (
              <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : (
              <div className="overflow-x-auto max-h-[700px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left relative">
                  <thead className="bg-[var(--accent-soft)] bg-opacity-90 sticky top-0 z-10 text-[10px] uppercase tracking-widest text-[var(--ink-muted)] font-bold backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-4">Poet</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Verses</th>
                      <th className="px-6 py-4">Joined</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)] text-sm">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-[var(--accent-soft)] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <InitialsAvatar name={u.displayName} size={32} />
                            <div>
                              <p className="font-semibold">{u.displayName}</p>
                              <p className="text-xs text-[var(--ink-muted)]">@{u.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                            u.role === 'ADMIN' ? "bg-amber-100 text-amber-900" : "bg-gray-100 text-gray-700"
                          )}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">{u._count.posts}</td>
                        <td className="px-6 py-4 text-xs text-[var(--ink-muted)]">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button 
                            disabled={updateUserMutation.isPending}
                            onClick={() => handleToggleRole(u)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Change User Role"
                          >
                            <Shield size={16} />
                          </button>
                          <button 
                            disabled={deleteUserMutation.isPending}
                            onClick={() => handleDeleteUser(u.id, u.role === 'ADMIN')}
                            className={cn(
                              "p-1.5 rounded",
                              u.role === 'ADMIN' ? "text-gray-300 cursor-not-allowed" : "text-rose-600 hover:bg-rose-50"
                            )}
                          >
                            <Trash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'posts' && (
          <motion.div
            key="posts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--bg-elev)] border border-[var(--line)] rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b border-[var(--line)] flex items-center justify-between">
               <h3 className="font-bold text-lg">Platform Verses</h3>
               <Filter size={16} className="text-[var(--ink-faint)]" />
            </div>
            {postsLoading ? (
              <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : (
              <div className="overflow-x-auto max-h-[700px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left relative">
                  <thead className="bg-[var(--accent-soft)] bg-opacity-90 sticky top-0 z-10 text-[10px] uppercase tracking-widest text-[var(--ink-muted)] font-bold backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-4">Title / Snippet</th>
                      <th className="px-6 py-4">Author</th>
                      <th className="px-6 py-4">Stats</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)] text-sm">
                    {postsData.posts.map((p) => (
                      <tr key={p.id} className="hover:bg-[var(--accent-soft)] transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[var(--ink)]">{p.title || 'Untitled Verse'}</p>
                          <p className="text-xs text-[var(--ink-muted)] opacity-70 italic leading-relaxed mt-1">
                            {p.body.length > 120 ? p.body.substring(0, 120) + '...' : p.body}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium">@{p.author.username}</td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3 text-[10px] text-[var(--ink-faint)] font-bold">
                             <span className="flex items-center gap-1"><Heart size={10} /> {p._count?.reactions || 0}</span>
                             <span className="flex items-center gap-1"><MessageSquare size={10} /> {p._count?.comments || 0}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-[var(--ink-muted)]">{relativeTime(p.createdAt)}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button 
                            disabled={deletePostMutation.isPending}
                            onClick={() => handleDeletePost(p.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
