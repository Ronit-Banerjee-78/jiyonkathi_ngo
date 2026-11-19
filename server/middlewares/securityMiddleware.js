/**
 * Security Middleware
 * Applies security response headers and input sanitization to protect against XSS, clickjacking, and injection attacks.
 */

/**
 * Enforces HTTPS in production environments when behind a reverse proxy (Render, Heroku, AWS, Nginx).
 * Dynamically relies on req.headers.host so any domain works seamlessly.
 */
export function enforceHttps(req, res, next) {
  if (process.env.NODE_ENV === "production") {
    // Exempt health check endpoints so cloud load balancers and container probes are not redirected
    const pathname = (req.path || "").toLowerCase();
    if (
      pathname === "/health" ||
      pathname === "/healthz" ||
      pathname === "/livez" ||
      pathname === "/readyz" ||
      pathname === "/ping" ||
      pathname === "/api/health"
    ) {
      return next();
    }

    const proto = req.headers["x-forwarded-proto"];
    if (proto && proto !== "https") {
      return res.redirect(301, `https://${req.headers.host}${req.originalUrl || req.url}`);
    }
  }
  next();
}

export function securityHeaders(req, res, next) {
  // Disable X-Powered-By
  res.removeHeader("X-Powered-By");

  // HTTP Security Headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' https: data:; connect-src 'self' https:; frame-ancestors 'self';",
  );

  next();
}

/**
 * Sanitize string inputs recursively against HTML / Script tags
 */
function sanitizeValue(val) {
  if (typeof val === "string") {
    return val
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "");
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  }
  if (val !== null && typeof val === "object") {
    const sanitizedObj = {};
    for (const key of Object.keys(val)) {
      sanitizedObj[key] = sanitizeValue(val[key]);
    }
    return sanitizedObj;
  }
  return val;
}

export function inputSanitizer(req, res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === "object") {
    for (const key of Object.keys(req.query)) {
      req.query[key] = sanitizeValue(req.query[key]);
    }
  }
  if (req.params && typeof req.params === "object") {
    for (const key of Object.keys(req.params)) {
      req.params[key] = sanitizeValue(req.params[key]);
    }
  }
  next();
}
