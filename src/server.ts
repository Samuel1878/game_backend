import app from "./app.js";
import "module-alias/register";
import { pool } from "./config/db.config.js";

const PORT = process.env.PORT || 3000;
(async () => {
  await pool.query("SELECT 1");
  console.log("DB ready");

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
})();