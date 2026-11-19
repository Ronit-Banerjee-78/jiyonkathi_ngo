export const logger = (req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";
  const debugEnabled = process.env.DEBUG_LOGS === "true";

  // In production, only log API requests if DEBUG_LOGS is explicitly enabled
  if (!isProd || debugEnabled) {
    // Avoid noisy static asset logs
    if (!req.url.startsWith("/assets/") && !req.url.startsWith("/images/")) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    }
  }
  next();
};
