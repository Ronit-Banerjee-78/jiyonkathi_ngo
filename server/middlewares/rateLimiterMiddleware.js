/**
 * Rate Limiter Middleware
 * Protects backend routes against brute force and DDoS attacks.
 * Uses an in-memory sliding window rate limiter.
 */

const ipRequestMap = new Map();

// Clean up stale IP records every 10 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [ip, data] of ipRequestMap.entries()) {
      if (now - data.resetTime > 15 * 60 * 1000) {
        ipRequestMap.delete(ip);
      }
    }
  },
  10 * 60 * 1000,
);

export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  maxRequests = 100,
  message = "Too many requests, please try again later.",
} = {}) => {
  return (req, res, next) => {
    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "unknown-ip";
    const now = Date.now();

    let record = ipRequestMap.get(clientIp);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      ipRequestMap.set(clientIp, record);
    } else {
      record.count += 1;
    }

    res.setHeader("X-RateLimit-Limit", maxRequests);
    res.setHeader(
      "X-RateLimit-Remaining",
      Math.max(0, maxRequests - record.count),
    );
    res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000));

    if (record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: message,
        retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    next();
  };
};

export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 2000, // generous allowance for admin dashboard interactions
});

export const strictUploadLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 1000, // generous allowance for admin file & media uploads
  message:
    "Upload rate limit reached. Please wait a moment before uploading more media.",
});
