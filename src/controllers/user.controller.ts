import { axiosInstance } from "@/config/api.js";
import { pool } from "@/config/db.config.js";
import type { User } from "@/types/user.type.js";
import type { Application, Request, Response, NextFunction } from "express";
export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// READ ONE
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });
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