import { verifyToken } from "../controllers/authController.js";

/**
 * Protects administrative routes by requiring a valid admin signed token
 */
export function adminAuthMiddleware(req, res, next) {
  // Allow health/status/get routes without auth
  if (req.method === "GET") {
    return next();
  }

  const authHeader = req.headers.authorization || req.headers["x-admin-token"];
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "প্রশাসনিক এক্সেস টোকেন প্রয়োজন (Admin authentication token required)",
    });
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "অবৈধ বা মেয়াদোত্তীর্ণ টোকেন (Invalid or expired admin token)",
    });
  }

  req.adminUser = payload;
  next();
}
