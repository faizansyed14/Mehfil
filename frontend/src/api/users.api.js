import client from './client';

export const usersApi = {
  checkUsername: (value) => client.get(`/users/check-username?value=${value}`).then(res => res.data),
  getProfile: (username) => client.get(`/users/${username}`).then(res => res.data),
  getFollowing: () => client.get('/users/me/following').then(res => res.data),
  updateMe: (data) => client.patch('/users/me', data).then(res => res.data),
  follow: (username) => client.post(`/users/${username}/follow`).then(res => res.data),
  unfollow: (username) => client.delete(`/users/${username}/follow`),
};
