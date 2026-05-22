import * as searchService from './search.service.js';

export async function search(req, res, next) {
  try {
    const result = await searchService.search({
      q: req.query.q,
      limit: req.query.limit,
      viewerId: req.user?.id,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}
