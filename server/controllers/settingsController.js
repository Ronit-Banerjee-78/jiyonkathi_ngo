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
      const data = result.rows[0].data || {};
      const { DEFAULT_PILLARS_DATA } = await import("../models/seedData.js");
      if (!Array.isArray(data.pillars) || data.pillars.length !== 2 || !data.pillars[0]?.titleBn?.includes("পরিবেশ সংকটকালে")) {
        data.pillars = DEFAULT_PILLARS_DATA.slice(0, 2);
      }
      res.json({
        success: true,
        data: data,
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

    const { DEFAULT_PILLARS_DATA } = await import("../models/seedData.js");
    if (data.pillars) {
      data.pillars = (Array.isArray(data.pillars) && data.pillars.length === 2 && data.pillars[0]?.titleBn?.includes("পরিবেশ সংকটকালে"))
        ? data.pillars.slice(0, 2)
        : DEFAULT_PILLARS_DATA.slice(0, 2);
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

    try {
      await pool.query(
        "INSERT INTO site_settings (data) VALUES ($1::jsonb)",
        [JSON.stringify(data)],
      );
    } catch (paramErr) {
      const jsonString = JSON.stringify(data).replace(/'/g, "''");
      await pool.query(
        `INSERT INTO site_settings (data) VALUES ('${jsonString}'::jsonb)`,
      );
    }
    res.json({ success: true, storage: "postgres" });
  } catch (error) {
    console.error("Error saving settings:", error.message);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

export { router as settingsRoutes };
