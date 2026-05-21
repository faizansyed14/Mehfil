import client from './client';

export const adminApi = {
  getDashboard: () => client.get('/admin/dashboard').then(res => res.data),
  getUsers: (params) => client.get('/admin/users', { params }).then(res => res.data),
  updateUser: (id, data) => client.patch(`/admin/users/${id}`, data).then(res => res.data),
  deleteUser: (id) => client.delete(`/admin/users/${id}`),
};
