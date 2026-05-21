import client from './client';

export const postsApi = {
  getPosts: (params) => client.get('/posts', { params }).then(res => res.data),
  getFollowing: (params) => client.get('/posts/following', { params }).then(res => res.data),
  getMyPosts: (params) => client.get('/posts/mine', { params }).then(res => res.data),
  getPost: (id) => client.get(`/posts/${id}`).then(res => res.data),
  create: (data) => client.post('/posts', data).then(res => res.data),
  update: (id, data) => client.patch(`/posts/${id}`, data).then(res => res.data),
  delete: (id) => client.delete(`/posts/${id}`),

  // Comments
  getComments: (id) => client.get(`/posts/${id}/comments`).then(res => res.data),
  createComment: (id, body) => client.post(`/posts/${id}/comments`, { body }).then(res => res.data),
  deleteComment: (postId, commentId) => client.delete(`/posts/${postId}/comments/${commentId}`),

  // Reactions
  getSummary: (id) => client.get(`/posts/${id}/reactions/summary`).then(res => res.data),
  toggleReaction: (id, type) => client.post(`/posts/${id}/reactions`, { type }).then(res => res.data),
};
