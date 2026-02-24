
import "module-alias/register";
import { pool } from "./config/db.config.js";
import httpServer from "./app.js";

const PORT = process.env.PORT || 3000;
(async () => {
  await pool.query("SELECT 1");
  console.log("PostgreSQL DB is ready");

  httpServer.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
})();