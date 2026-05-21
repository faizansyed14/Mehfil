import { useInfiniteQuery } from '@tanstack/react-query';
import { postsApi } from '../api/posts.api';

export function useInfiniteFeed(key, fetchFn, options = {}) {
  return useInfiniteQuery({
    queryKey: ['posts', key],
    queryFn: ({ pageParam }) => fetchFn({ cursor: pageParam }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    ...options
  });
}
