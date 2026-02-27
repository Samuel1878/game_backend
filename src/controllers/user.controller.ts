import { registerUserToSBO } from "@/handlers/auth.handler.js";
import { axiosInstance } from "../config/api.js";
import { pool } from "../config/db.config.js";
import type { User } from "../types/user.type.js";
import type { Application, Request, Response, NextFunction } from "express";

export const registerUser = async (req:Request, res:Response) => {
    const client = await pool.connect();
  try {
    const {name, agent, user_group} = req.body
    const exists = await client.query("SELECT id FROM users WHERE name=$1", [
      name,
    ]);
    exists &&
      (await axiosInstance
        .post("/web-root/restricted/player/register-player.aspx", {
          Username: name,
          UserGroup:user_group,
          Agent: agent,
          CompanyKey:
            process.env.COMPANY_KEY || "44348206360E4C218C9C5CA41E7EA02A",
          ServerId: process.env.SERVER_ID || "test02",
        })
        .then((response) => {
          if (response.data?.error && response.data?.error?.id > 0) {
            throw new Error(
              "External API registration failed: " + response.data.message,
            );
          }
          res.status(200).json({message:"External registration successful for user:"});
        })
        .catch((error) => {

          throw error;
        }));
  } catch (apiError) {
    res.status(500).json({message:"External Error!"})
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    // -------------------------
    // Query Params
    // -------------------------
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const agent = req.query.agent as string;

    const offset = (page - 1) * limit;

    // -------------------------
    // Dynamic Conditions
    // -------------------------
    const conditions: string[] = [];
    const values: any[] = [];

    if (search) {
      values.push(`%${search}%`);
      conditions.push(`name ILIKE $${values.length}`);
    }

    if (agent) {
      values.push(agent);
      conditions.push(`agent ILIKE $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // -------------------------
    // Get Total Count
    // -------------------------
    const countQuery = `
      SELECT COUNT(*) FROM users
      ${whereClause}
    `;

    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // -------------------------
    // Get Paginated Data
    // -------------------------
    values.push(limit);
    values.push(offset);

    const dataQuery = `
      SELECT id, name, role, level, agent, created_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${values.length - 1}
      OFFSET $${values.length}
    `;

    const dataResult = await pool.query(dataQuery, values);

    res.json({
      data: dataResult.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Pagination error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userName = req.session.userName;
    console.log("restoring :", userName)
    if (!userName) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE name = $1",
      [userName]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// UPDATE
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email, phone, level, role } = req.body as User;

    const result = await pool.query(
      `UPDATE users
       SET name = $1, email = $2, phone = $3, level = $4, role = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [name, email, phone, level, role, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// DELETE
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};


export const getUserBallance = async (req:Request, res:Response, next:NextFunction)=>{
  try {
      const {name} = req.query;
  // console.log(name)
      let data = JSON.stringify({
  "Username": name,
  "CompanyKey": "44348206360E4C218C9C5CA41E7EA02A",
  "ServerId": " test01"
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: '/web-root/restricted/player/get-player-balance.aspx',
  headers: { 
    'Content-Type': 'application/json', 
    'Cookie': '__cf_bm=6gTnQlYBlpQuJqhNWW4Yiaq8Bsv7NDPtcgL4.MVkqNg-1770743216.3348086-1.0.1.1-I5swbAlho58BQh9PRmFMbCCLQKoUGOwX1Lab8yI4ua753QbZOb.R5hbk7vIZ1QdE2X2HIFy66suuc7v.qhVaZ0XD2g8Uf3zN4Ylhihj0MNxAH1tSm_1loyQ.x5cJwUTV'
  },
  data : data
};

      const response = await axiosInstance.request(config);
      if (response.status ===200)return res.status(200).json(response.data)
  } catch (error) {
      console.error(error);
      next(error)
  }
}