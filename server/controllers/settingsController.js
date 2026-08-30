import express from "express";
import pool, { isDbConnected, ensureDbConnected } from "../models/db.js";

const router = express.Router();

let memorySettings = null; // In-memory fallback

// GET /api/settings
router.get("/", async (req, res) => {
  try {
    await ensureDbConnected();
    if (!isDbConnected) {
      return res.json({
        success: true,
        data: memorySettings,
        storage: "memory",
      });
    }

    const result = await pool.query(
      "SELECT data FROM site_settings ORDER BY id DESC LIMIT 1",
    );
    if (result.rows.length > 0) {
      res.json({
        success: true,
        data: result.rows[0].data,
        storage: "postgres",
      });
    } else {
      res.json({ success: true, data: null, storage: "postgres" }); // No settings saved yet
    }
  } catch (error) {
    console.error("Error fetching settings:", error.message);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

// POST /api/settings
router.post("/", async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res
        .status(400)
        .json({ success: false, error: "Data is required" });
    }

    await ensureDbConnected();
    if (!isDbConnected) {
      memorySettings = data;
      return res.json({
        success: true,
        storage: "memory",
        note: "Saved to memory fallback (DB disconnected)",
      });
    }

    // For Supabase connection pooler in transaction mode, prepared statements with JSONB fail.
    // So we manually stringify and escape it.
    const jsonString = JSON.stringify(data).replace(/'/g, "''");
    await pool.query(
      `INSERT INTO site_settings (data) VALUES ('${jsonString}')`,
    );
    res.json({ success: true, storage: "postgres" });
  } catch (error) {
    console.error("Error saving settings:", error.message);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

export { router as settingsRoutes };
