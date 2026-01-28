/**
 * Database utility for Vercel serverless functions
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema.js";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create connection pool with error handling
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("sslmode=require")
    ? { rejectUnauthorized: false }
    : undefined,
});

// Handle pool errors
pool.on("error", (err) => {
  console.error("❌ Unexpected database pool error:", err);
});

// Run lightweight, idempotent initialization to ensure the inquiries table exists
// This protects against deployments where migrations haven't been run manually.
const initSql = `
CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  customer_no TEXT,
  project_type TEXT NOT NULL,
  message TEXT NOT NULL,
  terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE inquiries
  ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);
`;

pool
  .query(initSql)
  .then(() => {
    console.log("✅ inquiries table is ready");
  })
  .catch((err) => {
    console.error("❌ Failed to initialize inquiries table:", err.message);
  });

export const db = drizzle(pool, { schema });

// Test database connection
pool
  .query("SELECT NOW()")
  .then(() => console.log("✅ Database connection successful"))
  .catch((err) =>
    console.error("❌ Database connection failed:", err.message),
  );
