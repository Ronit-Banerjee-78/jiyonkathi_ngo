import express from "express";
import pool, { isDbConnected, ensureDbConnected } from "../models/db.js";
import { adminAuthMiddleware } from "../middlewares/authMiddleware.js";
import { verifyToken } from "./authController.js";

const router = express.Router();

let memoryVolunteers = [];

// Helper to check if caller has valid admin session
const isAdminCaller = (req) => {
  const authHeader = req.headers.authorization || req.headers["x-admin-token"];
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader;
  if (!token) return false;
  const payload = verifyToken(token);
  return payload && payload.role === "admin";
};

// Helper: Auto-cleanup rejected volunteers older than 7 days
const cleanupExpiredRejections = () => {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  memoryVolunteers = memoryVolunteers.filter((v) => {
    if (v.status === "rejected" && v.rejectedAt) {
      return new Date(v.rejectedAt).getTime() > sevenDaysAgo;
    }
    return true;
  });
};

// Helper: Sanitize public volunteer record (strictly omit PII like email, phone, motivation, skills)
const sanitizePublicVolunteer = (v) => ({
  id: v.id,
  name: v.name,
  program: v.program,
  location: v.location,
  status: "approved",
  isDdbmpbs: Boolean(v.isDdbmpbs || v.is_ddbmpbs),
  createdAt: v.createdAt || v.created_at,
});

// GET /api/volunteers (Admin gets all records with PII; Public gets ONLY approved volunteers with PII stripped)
router.get("/", async (req, res) => {
  try {
    const isAdmin = isAdminCaller(req);
    cleanupExpiredRejections();
    await ensureDbConnected();

    if (!isDbConnected) {
      if (isAdmin) {
        return res.json({ success: true, volunteers: memoryVolunteers });
      }
      const publicVols = memoryVolunteers
        .filter((v) => v.status === "approved")
        .map(sanitizePublicVolunteer);
      return res.json({ success: true, volunteers: publicVols });
    }

    try {
      // Clean up in DB as well
      const sevenDaysAgo = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000,
      ).toISOString();
      await pool.query(
        "DELETE FROM volunteers WHERE status = 'rejected' AND rejected_at IS NOT NULL AND rejected_at < $1",
        [sevenDaysAgo],
      );

      if (isAdmin) {
        const result = await pool.query(
          "SELECT * FROM volunteers ORDER BY created_at DESC",
        );
        const mapped = result.rows.map((r) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          program: r.program,
          location: r.location,
          availability: r.availability,
          skills: r.skills,
          motivation: r.motivation,
          status: r.status || "pending",
          isDdbmpbs: Boolean(r.is_ddbmpbs),
          rejectedAt: r.rejected_at,
          createdAt: r.created_at,
        }));
        return res.json({ success: true, volunteers: mapped });
      }

      // Public caller: ONLY approved volunteers, strictly NO sensitive PII
      const result = await pool.query(
        "SELECT id, name, program, location, is_ddbmpbs, created_at FROM volunteers WHERE status = 'approved' ORDER BY created_at DESC",
      );
      const mapped = result.rows.map(sanitizePublicVolunteer);
      res.json({ success: true, volunteers: mapped });
    } catch (dbErr) {
      console.warn(
        "DB query failed for volunteers, using memory fallback:",
        dbErr.message,
      );
      if (isAdmin) {
        return res.json({ success: true, volunteers: memoryVolunteers });
      }
      const publicVols = memoryVolunteers
        .filter((v) => v.status === "approved")
        .map(sanitizePublicVolunteer);
      res.json({ success: true, volunteers: publicVols });
    }
  } catch (error) {
    console.error("Error fetching volunteers:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// GET /api/volunteers/public - Explicit public endpoint for approved volunteers
router.get("/public", async (req, res) => {
  try {
    await ensureDbConnected();
    if (!isDbConnected) {
      const publicVols = memoryVolunteers
        .filter((v) => v.status === "approved")
        .map(sanitizePublicVolunteer);
      return res.json({ success: true, volunteers: publicVols });
    }

    try {
      const result = await pool.query(
        "SELECT id, name, program, location, is_ddbmpbs, created_at FROM volunteers WHERE status = 'approved' ORDER BY created_at DESC",
      );
      res.json({ success: true, volunteers: result.rows.map(sanitizePublicVolunteer) });
    } catch (dbErr) {
      const publicVols = memoryVolunteers
        .filter((v) => v.status === "approved")
        .map(sanitizePublicVolunteer);
      res.json({ success: true, volunteers: publicVols });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// POST /api/volunteers
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      program,
      location,
      availability,
      skills,
      motivation,
      isDdbmpbs,
    } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, error: "Name and Email are required" });
    }

    const newVol = {
      id: `v-${Date.now()}`,
      name,
      email,
      phone: phone || "",
      program: program || "General Volunteer",
      location: location || "",
      availability: availability || "Flexible",
      skills: skills || "",
      motivation: motivation || "",
      status: "pending",
      isDdbmpbs: Boolean(isDdbmpbs),
      rejectedAt: null,
      createdAt: new Date().toISOString(),
    };

    memoryVolunteers.unshift(newVol);

    await ensureDbConnected();
    if (isDbConnected) {
      try {
        await pool.query(
          `CREATE TABLE IF NOT EXISTS volunteers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            program TEXT,
            location TEXT,
            availability TEXT,
            skills TEXT,
            motivation TEXT,
            status TEXT DEFAULT 'pending',
            is_ddbmpbs BOOLEAN DEFAULT false,
            rejected_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );`,
        );

        await pool.query(
          `INSERT INTO volunteers (id, name, email, phone, program, location, availability, skills, motivation, status, is_ddbmpbs, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            newVol.id,
            name,
            email,
            phone || "",
            program || "",
            location || "",
            availability || "",
            skills || "",
            motivation || "",
            "pending",
            Boolean(isDdbmpbs),
            newVol.createdAt,
          ],
        );
      } catch (dbErr) {
        console.warn(
          "DB insert failed for volunteer, using memory fallback:",
          dbErr.message,
        );
      }
    }

    res.json({ success: true, volunteer: newVol });
  } catch (error) {
    console.error("Error creating volunteer application:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// PUT /api/volunteers/:id (Admin only)
router.put("/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isDdbmpbs } = req.body;

    const rejectedAt = status === "rejected" ? new Date().toISOString() : null;

    const idx = memoryVolunteers.findIndex((v) => v.id === id);
    if (idx !== -1) {
      memoryVolunteers[idx] = {
        ...memoryVolunteers[idx],
        ...(status ? { status } : {}),
        ...(isDdbmpbs !== undefined ? { isDdbmpbs: Boolean(isDdbmpbs) } : {}),
        ...(status === "rejected"
          ? { rejectedAt }
          : status === "approved"
            ? { rejectedAt: null }
            : {}),
      };
    }

    await ensureDbConnected();
    if (isDbConnected) {
      try {
        await pool.query(
          `UPDATE volunteers
           SET status = COALESCE($1, status),
               is_ddbmpbs = COALESCE($2, is_ddbmpbs),
               rejected_at = $3
           WHERE id = $4`,
          [
            status,
            isDdbmpbs !== undefined ? Boolean(isDdbmpbs) : null,
            rejectedAt,
            id,
          ],
        );
      } catch (dbErr) {
        console.warn("DB update error for volunteer:", dbErr.message);
      }
    }

    const updated = memoryVolunteers.find((v) => v.id === id);
    res.json({ success: true, volunteer: updated });
  } catch (error) {
    console.error("Error updating volunteer:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// DELETE /api/volunteers/:id (Admin only)
router.delete("/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    memoryVolunteers = memoryVolunteers.filter((v) => v.id !== id);

    await ensureDbConnected();
    if (isDbConnected) {
      try {
        await pool.query("DELETE FROM volunteers WHERE id = $1", [id]);
      } catch (dbErr) {
        console.warn("DB delete failed for volunteer:", dbErr.message);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting volunteer:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export { router as volunteerRoutes };
