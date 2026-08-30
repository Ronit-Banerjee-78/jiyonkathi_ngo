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
