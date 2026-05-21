import { AppError } from './error.js';

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid request data', result.error.flatten().fieldErrors);
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Invalid query parameters', result.error.flatten().fieldErrors);
    }
    req.query = result.data;
    next();
  };
}
