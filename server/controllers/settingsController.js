import express from "express";
import pool, { isDbConnected, ensureDbConnected } from "../models/db.js";
import { adminAuthMiddleware } from "../middlewares/authMiddleware.js";
import { FULL_INITIAL_SITE_DATA as initialSiteData } from "../models/seedData.js";

const router = express.Router();

let memorySettings = null; // In-memory fallback

/**
 * Fetch all gallery items from settings or seed data
 */
export async function getAllGalleryItems() {
  await ensureDbConnected();
  if (isDbConnected) {
    try {
      const result = await pool.query(
        "SELECT data FROM site_settings ORDER BY id DESC LIMIT 1"
      );
      if (result.rows.length > 0 && Array.isArray(result.rows[0].data?.gallery)) {
        return result.rows[0].data.gallery;
      }
    } catch (err) {
      console.warn("DB query gallery error:", err.message);
    }
  }
  return (memorySettings?.gallery || initialSiteData.gallery || []);
}

/**
 * Fetch single gallery item by ID
 */
export async function getGalleryItemById(id) {
  const items = await getAllGalleryItems();
  const searchId = String(id).toLowerCase().trim();
  return items.find((item) => String(item.id).toLowerCase() === searchId) || null;
}

function sanitizeSiteData(data) {
  if (!data || typeof data !== "object") return data;
  if (data.general) {
    if (data.general.bannerTitleBengali && typeof data.general.bannerTitleBengali === "string") {
      data.general.bannerTitleBengali = data.general.bannerTitleBengali.replace(/টানে/g, "আহ্বানে");
    }
    if (data.general.bannerHeadingBengali && typeof data.general.bannerHeadingBengali === "string") {
      data.general.bannerHeadingBengali = data.general.bannerHeadingBengali.replace(/টানে/g, "আহ্বানে");
    }
    if (
      data.general.bannerSubtitleBengali?.includes("বীরভূম, বর্ধমান ও আউশগ্রামের গ্রামাঞ্চলে") ||
      data.general.bannerSubtitleBengali?.includes("সমাজ")
    ) {
      data.general.bannerSubtitleBengali =
        "বাংলার গ্রামাঞ্চলে বিষমুক্ত জৈব চাষ, ৫৬ রকম দেশীয় ধানের প্রজাতি সংরক্ষণ, শিশুদের সহায়ক শিক্ষা কেন্দ্র ও প্রকৃতি সচেতনতা বিকাশে নিয়োজিত একটি অলাভজনক সংস্থা।";
    }
    if (data.general.statFamilies === "৩৫০+") {
      data.general.statFamilies = "৫০+";
    }
  }
  if (Array.isArray(data.pillars)) {
    data.pillars = JSON.parse(
      JSON.stringify(data.pillars)
        .replace(/যতটা কম সম্ভব/g, "যতটা সম্ভব কম")
        .replace(/বিষমুক্ত ফল-সবজি চাষ ও প্রাকৃতিক খাদ্য নিরাপত্তা/g, "ফল-সব্জির বিষমুক্ত চাষ")
    );
  }
  return data;
}

// GET /api/settings
router.get("/", async (req, res) => {
  try {
    await ensureDbConnected();
    if (!isDbConnected) {
      return res.json({
        success: true,
        data: sanitizeSiteData(memorySettings),
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
      const sanitized = sanitizeSiteData(data);
      res.json({
        success: true,
        data: sanitized,
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

// GET /api/settings/gallery/:id & /api/settings/images/:id - Fetch single image item by ID
const handleSingleGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await getGalleryItemById(id);
    if (!item) {
      return res.status(404).json({ success: false, error: "Image not found" });
    }
    res.json({ success: true, image: item, item });
  } catch (err) {
    console.error("Error fetching gallery item:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

router.get("/gallery/:id", handleSingleGalleryItem);
router.get("/images/:id", handleSingleGalleryItem);

// POST /api/settings - Protected by adminAuthMiddleware
router.post("/", adminAuthMiddleware, async (req, res) => {
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

    const sanitizedData = sanitizeSiteData(data);

    await ensureDbConnected();
    if (!isDbConnected) {
      memorySettings = sanitizedData;
      return res.json({
        success: true,
        storage: "memory",
        note: "Saved to memory fallback (DB disconnected)",
      });
    }

    try {
      await pool.query(
        "INSERT INTO site_settings (data) VALUES ($1::jsonb)",
        [JSON.stringify(sanitizedData)],
      );
    } catch (paramErr) {
      const jsonString = JSON.stringify(sanitizedData).replace(/'/g, "''");
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

