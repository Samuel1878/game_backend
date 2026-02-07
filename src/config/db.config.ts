import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();


export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "zynn",
  password: process.env.DB_PASSWORD || "Aa187881@",
  database: process.env.DB_NAME || "game_db",
  ssl: false,
   max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxLifetimeSeconds: 60
});
pool.on("acquire", () => {
  console.log("PostgreSQL connection acquired");            
})

pool.on("connect", () => {
  console.log("PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("Postgres error", err);
});

export const query = (text: string, params?: any[]) => pool.query(text, params)
