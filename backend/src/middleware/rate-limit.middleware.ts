import rateLimit from 'express-rate-limit';

// Allow up to 120 API calls per minute from one client, then ask them to slow down.
// Example: request 121 within 60s → 429 with "Too many requests…".
export const apiRateLimiter = rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: {error: 'Too many requests, please try again later'},
});
