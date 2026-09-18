/**
 * Jiyonkathi Database Seed Script
 * Run: node server/seedDatabase.js
 * Automatically populates PostgreSQL / Cloud SQL or SQLite tables with all static assets,
 * research reports, demo members, pillars, gallery records, and events.
 */

import pool, { initDB, isDbConnected } from "./models/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { FULL_INITIAL_SITE_DATA } from "./models/seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedDatabase() {
  console.log("🌱 Starting Jiyonkathi Database Seeding...");
  await initDB();

  if (!isDbConnected) {
    console.log("ℹ️ Database connection is in fallback mode. Seed records will persist in memory / JSON storage.");
    return;
  }

  const client = await pool.connect();
  try {
    console.log("📦 Creating and populating site_settings...");
    const seedData = FULL_INITIAL_SITE_DATA;

    await client.query(
      `INSERT INTO site_settings (id, data, updated_at) 
       VALUES (1, $1, CURRENT_TIMESTAMP) 
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP;`,
      [JSON.stringify(seedData)]
    );

    console.log("✅ Seed completed successfully!");
  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    client.release();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}

export default seedDatabase;
