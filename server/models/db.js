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

      // Seed / Sync research reports into DB
      try {
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
              ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                title_english = EXCLUDED.title_english,
                topic = EXCLUDED.topic,
                topic_english = EXCLUDED.topic_english,
                author = EXCLUDED.author,
                published_date = EXCLUDED.published_date,
                summary = EXCLUDED.summary,
                summary_english = EXCLUDED.summary_english,
                content = EXCLUDED.content,
                content_english = EXCLUDED.content_english,
                image = EXCLUDED.image,
                methodology = EXCLUDED.methodology,
                findings = EXCLUDED.findings`,
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
            `Synced ${defaultReports.length} research reports into DB.`,
          );
        }
      } catch (seedErr) {
        console.warn("Could not seed default reports:", seedErr.message);
      }

      // Seed initial site_settings with complete site data if empty
      try {
        const settingsRes = await client.query(
          "SELECT id, data FROM site_settings ORDER BY id DESC LIMIT 1",
        );
        const { FULL_INITIAL_SITE_DATA, DEFAULT_PILLARS_DATA } = await import("./seedData.js");
        if (settingsRes.rows.length === 0) {
          await client.query(
            "INSERT INTO site_settings (data) VALUES ($1::jsonb)",
            [JSON.stringify(FULL_INITIAL_SITE_DATA)],
          );
          console.log("Seeded initial site_settings with complete database package.");
        } else {
          // If settings exist, ensure pillars and other core fields are populated
          const currentData = settingsRes.rows[0].data || {};
          let needsUpdate = false;
          const mergedData = { ...FULL_INITIAL_SITE_DATA, ...currentData };
          if (!currentData.pillars || currentData.pillars.length !== 2 || !currentData.pillars[0]?.titleBn?.includes("পরিবেশ সংকটকালে")) {
            mergedData.pillars = DEFAULT_PILLARS_DATA.slice(0, 2);
            needsUpdate = true;
          }
          if (!currentData.general) {
            mergedData.general = FULL_INITIAL_SITE_DATA.general;
            needsUpdate = true;
          }
          if (needsUpdate) {
            await client.query(
              "UPDATE site_settings SET data = $1::jsonb WHERE id = $2",
              [JSON.stringify(mergedData), settingsRes.rows[0].id],
            );
            console.log("Updated site_settings with missing default structures.");
          }
        }
      } catch (settingsSeedErr) {
        console.warn(
          "Could not seed site_settings into DB:",
          settingsSeedErr.message,
        );
      }

      // Seed initial projects if empty
      try {
        const projRes = await client.query("SELECT COUNT(*) FROM projects");
        const projCount = parseInt(projRes.rows[0]?.count || "0", 10);
        if (projCount === 0) {
          const { DEFAULT_PROJECTS_DATA } = await import("./seedData.js");
          for (const p of DEFAULT_PROJECTS_DATA) {
            await client.query(
              "INSERT INTO projects (title, target_amount) VALUES ($1, $2)",
              [p.title, p.target_amount],
            );
          }
          console.log(`Seeded ${DEFAULT_PROJECTS_DATA.length} initial projects into DB.`);
        }
      } catch (projSeedErr) {
        console.warn("Could not seed default projects into DB:", projSeedErr.message);
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
