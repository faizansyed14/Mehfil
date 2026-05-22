import client from './client';

export const searchApi = {
  search: ({ q, limit = 8 }) =>
    client.get('/search', { params: { q, limit } }).then((res) => res.data),
};
