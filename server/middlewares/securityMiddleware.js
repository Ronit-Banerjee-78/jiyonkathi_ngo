/**
 * Security Middleware
 * Applies security response headers and input sanitization to protect against XSS, clickjacking, and injection attacks.
 */

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
    "max-age=31536000; includeSubDomains",
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
