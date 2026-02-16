import { axiosInstance } from "@/config/api.js";
import { pool } from "@/config/db.config.js";
import type { ApiResponse, UserRequest } from "@/types/user.type.js";
import bcrypt from "bcryptjs";
import type { Application, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const client = await pool.connect();
  try {
    const { name, password } = req.body;
    await client.query("BEGIN");
    // Check existing
    const exists = await client.query("SELECT id FROM users WHERE name=$1", [
      name,
    ]);

    if (exists.rows.length) {
      await client.query("ROLLBACK");
      return res.status(203).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    // Insert local user
    const result = await client.query(
      `INSERT INTO users (name,password)
       VALUES ($1,$2)
       RETURNING *`,
      [name, hashed],
    );

    const user = await result.rows[0];
    await client.query(
      `INSERT INTO wallets (user_id, balance)
       VALUES ($1, 0)`,
      [user.id],
    );

    // External registration (retry once)
    try {
      await axiosInstance
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
        });
    } catch (apiError) {
      // Compensation: remove local user
      await client.query("DELETE FROM users WHERE id=$1", [user.id]);
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "External provider registration failed",
      });
    }

    // Commit DB
    await client.query("COMMIT");

    // JWT
    const token = jwt.sign(
      { id: user.uid, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    delete user.password;

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err });
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
};9


export const Login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const client = await pool.connect();
  try {
    const { name, password } = req.body;
    let userRes: ApiResponse;

    const userResult = await client.query("SELECT * FROM users WHERE name=$1", [
      name,
    ]);

    if (!userResult.rows.length)
      return res.status(401).json({ message: "Invalid credentials (name)" });

    const user = userResult.rows[0];

    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
      return res
        .status(401)
        .json({ message: "Invalid credentials (password)" });
    try {
      userRes = await axiosInstance
        .post("/web-root/restricted/player/login.aspx", {
          IsWapSports: false,
          Username: user.name,
          Portfolio: "SeamlessGame",
          CompanyKey:
            process.env.COMPANY_KEY || "CB33E42BFAD04F90BA3B25F7EB257810",
          ServerId: process.env.SERVER_ID || "test01",
        })
        .then((response) => response.data)
        .catch((error) => {
          throw error;

        });
   } catch (apiError) {
      // Compensation: remove local user

      await client.query("ROLLBACK");

      return res.status(502).json({
        message: "External provider registration failed",
      });
    }

    await client.query("COMMIT");
    const token = jwt.sign(
      { id: user.uid, name: user.name },
      process.env.JWT_SECRET || "supersecretkey123",
      { expiresIn: "1d" },
    );

    delete user.password;
    console.log("User logged in:", user.name);
    res.status(200).json({ token, user, url: userRes.url });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Internal Server Error!" });
    next(err);
  }
};
