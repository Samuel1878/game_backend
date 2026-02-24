import { axiosInstance } from "@/config/api.js";
import { pool } from "@/config/db.config.js";

export const registerAgent = async () => {};
export const registerUserToSBO = async ({
  name,
  password,
}: {
  name: string;
  password: string;
}) => {
  const client = await pool.connect();
  try {
    const exists = await client.query("SELECT id FROM users WHERE name=$1", [
      name,
    ]);
    exists &&
      (await axiosInstance
        .post("/web-root/restricted/player/register-player.aspx", {
          Username: name,
          UserGroup: "a",
          Agent: "AgentMM",
          CompanyKey:
            process.env.COMPANY_KEY || "CB33E42BFAD04F90BA3B25F7EB257810",
          ServerId: process.env.SERVER_ID || "test02",
        })
        .then((response) => {
          if (response.data?.error && response.data?.error?.id > 0) {
            throw new Error(
              "External API registration failed: " + response.data.message,
            );
          }
          console.log("External registration successful for user:", name);
        })
        .catch((error) => {
          throw error;
        }));
  } catch (apiError) {}
};
