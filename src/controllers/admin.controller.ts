import { axiosInstance } from "@/config/api.js";
import { pool } from "@/config/db.config.js";
import type { NextFunction, Request, Response } from "express";
import { io } from "../app.js";

export const createAgent = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const body = req.body;
    await client.query("BEGIN");
    // 1️⃣ Check local duplicate
    const exists = await client.query(
      "SELECT id FROM agents WHERE username=$1",
      [body.Username]
    );
    if (exists.rows.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Agent already exists" });
    }
    // 2️⃣ Call 568Win API
    const response = await axiosInstance.post(
      `/web-root/restricted/agent/register-agent.aspx`,
      {
        ...body,
          CompanyKey: "CB33E42BFAD04F90BA3B25F7EB257810",
     ServerId: "test01",
      },
      { headers: { "Content-Type": "application/json" } }
    );
    if (response.data?.error?.id !== 0) {
      await client.query("ROLLBACK");
      return res.status(400).json(response.data.error);
    }
    // 3️⃣ Save locally
    const result = await client.query(
      `
      INSERT INTO agents 
      (username, currency, min, max, max_per_match, casino_table_limit, is_two_fa_enabled, server_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        body.Username,
        body.Currency,
        body.Min,
        body.Max,
        body.MaxPerMatch,
        body.CasinoTableLimit,
        body.IsTwoFAEnabled ?? true,
        process.env.SERVER_ID,
      ]
    );
    await client.query("COMMIT");

    io.emit("agent:created");
    res.json(result.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Agent creation failed" });
  } finally {
    client.release();
  }
};
export const getAgents = async (_: Request, res: Response) => {
    try {
         const result = await pool.query(
    "SELECT * FROM agents ORDER BY created_at DESC"
  );
  res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({message:"Query failed"})
    }
 
};
export const updateAgent = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query(
    `
    UPDATE agents
    SET min=$1, max=$2, max_per_match=$3, casino_table_limit=$4
    WHERE id=$5
    RETURNING *
    `,
    [
      req.body.Min,
      req.body.Max,
      req.body.MaxPerMatch,
      req.body.CasinoTableLimit,
      id,
    ]
  );

  io.emit("agent:updated");

  res.json(result.rows[0]);
};
export const deleteAgent = async (req: Request, res: Response) => {
  await pool.query("DELETE FROM agents WHERE id=$1", [req.params.id]);

  io.emit("agent:deleted");

  res.json({ message: "Deleted" });
};
// export const registerAgent = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//     const client = await pool.connect();
//     try{
//         const {agentName, currency, min, max,} = req.body
//          await client.query("BEGIN");
//   let data = JSON.stringify({
//     Username: "AgentMM",
//     Password: "tester5",
//     Currency: "MMK",
//     Min: 1,
//     Max: 5000,
//     MaxPerMatch: 20000,
//     CasinoTableLimit: 4,
//     IsTwoFAEnabled: false,
//     CompanyKey: "CB33E42BFAD04F90BA3B25F7EB257810",
//     ServerId: "test01",
//   });

//   let config = {
//     method: "post",
//     maxBodyLength: Infinity,
//     url: "https://ex-api-demo-yy.568win.com/web-root/restricted/agent/register-agent.aspx",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     data: data,
//   };

//   axiosInstance
//     .request(config)
//     .then((response) => {
//       console.log(JSON.stringify(response.data));
//     })
//     .catch((error) => {
//       console.log(error);
//     });
//     } catch(error){

//     }

// };
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
