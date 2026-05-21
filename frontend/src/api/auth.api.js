import client from './client';

export const authApi = {
  signup: (data) => client.post('/auth/signup', data).then(res => res.data),
  signin: (data) => client.post('/auth/signin', data).then(res => res.data),
  signout: () => client.post('/auth/signout'),
  getMe: () => client.get('/auth/me').then(res => res.data),
  refresh: () => client.post('/auth/refresh').then(res => res.data),
};
