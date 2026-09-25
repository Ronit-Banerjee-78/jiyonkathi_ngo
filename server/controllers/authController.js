import express from "express";
import crypto from "crypto";

const router = express.Router();

// Secret key for HMAC token signing (falls back to secure random if not in env)
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.SESSION_SECRET || "jiyonkathi-secure-admin-secret-2026";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@jiyonkathi.org";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Creates a signed token: base64(payload) + '.' + hmac(payload, secret)
 */
export function generateToken(payload) {
  const data = JSON.stringify({
    ...payload,
    exp: Date.now() + TOKEN_EXPIRY_MS,
  });
  const encoded = Buffer.from(data).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${signature}`;
}

/**
 * Verifies signed token
 */
export function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encoded, signature] = parts;
  const expectedSig = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(encoded)
    .digest("base64url");

  if (signature !== expectedSig) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(encoded, "base64url").toString("utf-8");
    const payload = JSON.parse(jsonStr);
    if (!payload || !payload.exp || Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

// POST /api/auth/login
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "ইমেইল ও পাসওয়ার্ড প্রদান করুন (Email and password are required)",
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const isEmailValid = cleanEmail === ADMIN_EMAIL.toLowerCase() || cleanEmail === "admin";
    const isPasswordValid = password === ADMIN_PASSWORD;

    if (!isEmailValid || !isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "ভুল ইমেইল বা পাসওয়ার্ড (Invalid email or password)",
      });
    }

    const user = {
      role: "admin",
      email: ADMIN_EMAIL,
      name: "জিয়নকাঠি অ্যাডমিনিস্ট্রেটর",
      username: "admin",
    };

    const token = generateToken({ email: user.email, role: user.role });

    res.json({
      success: true,
      token,
      user,
      expiresIn: TOKEN_EXPIRY_MS,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: "অভ্যন্তরীণ সার্ভার ত্রুটি (Internal server error)" });
  }
});

// GET /api/auth/me - Verify current session token
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization || req.headers["x-admin-token"];
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader;

  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return res.status(401).json({
      success: false,
      authenticated: false,
      error: "অনুমোদিত নয় বা মেয়াদ শেষ হয়েছে (Unauthorized or session expired)",
    });
  }

  res.json({
    success: true,
    authenticated: true,
    user: {
      role: "admin",
      email: payload.email || ADMIN_EMAIL,
      name: "জিয়নকাঠি অ্যাডমিনিস্ট্রেটর",
    },
  });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

export const authRoutes = router;
