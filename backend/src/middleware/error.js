export function centralErrorHandler(err, req, res, _next) {
  console.trace('ERROR CAUGHT BY CENTRAL HANDLER:');
  console.error(err.stack || err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  const code = err.code || 'INTERNAL_ERROR';

  res.status(status).json({
    error: {
      code,
      message: status === 500 && process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : message,
      ...(err.details && { details: err.details }),
    },
  });
}

export class AppError extends Error {
  constructor(statusCode, code, message, details) {
    super(message);
    this.status = statusCode;
    this.code = code;
    this.details = details;
  }
}
