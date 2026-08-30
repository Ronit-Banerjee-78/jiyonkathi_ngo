import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Helper to construct connection pool settings
const getPoolConfig = () => {
  // Option 1: Explicit DB_* environment variables
  if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD) {
    const isRemote =
      process.env.DB_HOST !== "localhost" &&
      process.env.DB_HOST !== "127.0.0.1";
    return {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT) || 5432,
      ...(isRemote ? { ssl: { rejectUnauthorized: false } } : {}),
      connectionTimeoutMillis: 5000,
    };
  }

  // Option 2: Full connection string (DATABASE_URL)
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    };
  }

  // Option 3: Local defaults
  return {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
    connectionTimeoutMillis: 3000,
  };
};

let pool = new Pool(getPoolConfig());

pool.on("error", (err) => {
  console.error("Unexpected error on idle DB client:", err.message);
});

export let isDbConnected = false;

export const initDB = async () => {
  if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
    isDbConnected = false;
    console.log(
      "No PostgreSQL host/URL configured — operating in in-memory fallback mode.",
    );
    return;
  }
  try {
    pool = new Pool(getPoolConfig());
    const client = await pool.connect();

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS site_settings (
          id SERIAL PRIMARY KEY,
          data JSONB NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          target_amount NUMERIC NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS site_files (
          id SERIAL PRIMARY KEY,
          filename TEXT NOT NULL,
          mimetype TEXT NOT NULL,
          data BYTEA NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS events (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          title_english TEXT,
          date_str TEXT,
          date_english TEXT,
          time_str TEXT,
          time_english TEXT,
          location TEXT,
          location_english TEXT,
          description TEXT,
          full_details TEXT,
          full_details_english TEXT,
          image TEXT,
          category TEXT,
          category_english TEXT,
          status TEXT DEFAULT 'upcoming',
          spots_left INT DEFAULT 0,
          total_spots INT DEFAULT 100,
          our_work_ref TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS research_reports (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          title_english TEXT,
          topic TEXT,
          topic_english TEXT,
          author TEXT,
          published_date TEXT,
          summary TEXT,
          summary_english TEXT,
          content TEXT NOT NULL,
          content_english TEXT,
          image TEXT,
          methodology JSONB,
          findings JSONB,
          download_url TEXT,
          views INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS volunteers (
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
        );
      `);

      // Seed research reports if table is empty
      try {
        const reportCountRes = await client.query(
          "SELECT COUNT(*) FROM research_reports",
        );
        const reportCount = parseInt(reportCountRes.rows[0]?.count || "0", 10);
        if (reportCount === 0) {
          const { defaultReports } =
            await import("../controllers/reportController.js");
          if (defaultReports && defaultReports.length > 0) {
            for (const rep of defaultReports) {
              await client.query(
                `INSERT INTO research_reports (
                  id, title, title_english, topic, topic_english, author,
                  published_date, summary, summary_english, content, content_english,
                  image, methodology, findings, views
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                ON CONFLICT (id) DO NOTHING`,
                [
                  rep.id,
                  rep.title,
                  rep.titleEnglish || null,
                  rep.topic || null,
                  rep.topicEnglish || null,
                  rep.author || null,
                  rep.publishedDate || null,
                  rep.summary || null,
                  rep.summaryEnglish || null,
                  rep.content,
                  rep.contentEnglish || null,
                  rep.image || null,
                  JSON.stringify(rep.methodology || []),
                  JSON.stringify(rep.findings || []),
                  rep.views || 0,
                ],
              );
            }
            console.log(
              `Seeded ${defaultReports.length} research reports into DB.`,
            );
          }
        }
      } catch (seedErr) {
        console.warn("Could not seed default reports:", seedErr.message);
      }

      // Seed initial site_settings with default pillars if empty
      try {
        const settingsRes = await client.query(
          "SELECT id, data FROM site_settings ORDER BY id DESC LIMIT 1",
        );
        const { DEFAULT_PILLARS_DATA } = await import("./seedData.js");
        if (settingsRes.rows.length === 0) {
          const initialData = {
            pillars: DEFAULT_PILLARS_DATA,
          };
          const jsonString = JSON.stringify(initialData).replace(/'/g, "''");
          await client.query(
            `INSERT INTO site_settings (data) VALUES ('${jsonString}'::jsonb)`,
          );
          console.log("Seeded initial site_settings with 4 core pillars.");
        } else {
          // If settings exist but pillars array is missing or empty, ensure pillars are present
          const currentData = settingsRes.rows[0].data || {};
          if (!currentData.pillars || currentData.pillars.length === 0) {
            const updatedData = {
              ...currentData,
              pillars: DEFAULT_PILLARS_DATA,
            };
            const jsonString = JSON.stringify(updatedData).replace(/'/g, "''");
            await client.query(
              `UPDATE site_settings SET data = '${jsonString}'::jsonb WHERE id = $1`,
              [settingsRes.rows[0].id],
            );
            console.log("Updated existing site_settings with 4 core pillars.");
          }
        }
      } catch (settingsSeedErr) {
        console.warn(
          "Could not seed default pillars into site_settings:",
          settingsSeedErr.message,
        );
      }

      isDbConnected = true;
      console.log("Database initialized successfully.");
    } finally {
      client.release();
    }
  } catch (error) {
    isDbConnected = false;
    console.warn(
      `Database connection failed (${error.message}) — using in-memory fallback mode.`,
    );
  }
};

export const ensureDbConnected = async () => {
  if (isDbConnected) return true;
  await initDB();
  return isDbConnected;
};

export default pool;
