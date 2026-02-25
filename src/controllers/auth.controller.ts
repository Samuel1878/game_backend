
import { axiosInstance } from "@/config/api.js";
import { pool } from "../config/db.config.js";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    userName?: string | number;
  }
}

export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const client = await pool.connect();
  try {
    const { name, password } = req.body;
    await client.query("BEGIN");
    const exists = await client.query("SELECT id FROM users WHERE name=$1", [
      name,
    ]);

    if (exists.rows.length) {
      await client.query("ROLLBACK");
      return res.status(203).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await client.query(
      `INSERT INTO users (name,password)
       VALUES ($1,$2)
       RETURNING *`,
      [name, hashed]
    );

    const user = result.rows[0];
    await client.query("COMMIT");
    delete user.password;
    req.session.userName = result.rows[0].name;
    res.status(200).json(user);
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Registration failed", error: err });
    next(err);
  } finally {
    client.release();
  }
};

export const login = async (req: Request, res: Response, next:NextFunction) => {
  const client = await pool.connect();
  try {
    const { name, password } = req.body;
    const userResult = await client.query("SELECT * FROM users WHERE name=$1", [
      name,
    ]);

    if (!userResult.rows.length) return res.status(401).json({ message: "Invalid credentials : " + name });
    const user = userResult.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
        return res
          .status(401)
          .json({ message: "Invalid credentials (password)" });
    req.session.userName = userResult.rows[0].name;
    res.status(200).json(user);
  } catch (error) {
      await client.query("ROLLBACK");
    res.status(500).json({ message: "Internal Server Error!" });
    next(error);
  }
};

// export const Login = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const client = await pool.connect();
//   try {
//     const { name, password } = req.body;
//     let userRes: ApiResponse;

//     const userResult = await client.query("SELECT * FROM users WHERE name=$1", [
//       name,
//     ]);

//     if (!userResult.rows.length)
//       return res.status(401).json({ message: "Invalid credentials (name)" });

//     const user = userResult.rows[0];

//     const valid = await bcrypt.compare(password, user.password);

//     if (!valid)
//       return res
//         .status(401)
//         .json({ message: "Invalid credentials (password)" });
//     try {
//       userRes = await axiosInstance
//         .post("/web-root/restricted/player/login.aspx", {
//           IsWapSports: false,
//           Username: user.name,
//           Portfolio: "SeamlessGame",
//           CompanyKey:
//             process.env.COMPANY_KEY || "CB33E42BFAD04F90BA3B25F7EB257810",
//           ServerId: process.env.SERVER_ID || "test01",
//         })
//         .then((response) => response.data)
//         .catch((error) => {
//           throw error;

//         });
//    } catch (apiError) {
//       // Compensation: remove local user

//       await client.query("ROLLBACK");

//       return res.status(502).json({
//         message: "External provider registration failed",
//       });
//     }

//     await client.query("COMMIT");
//     const token = jwt.sign(
//       { id: user.uid, name: user.name },
//       process.env.JWT_SECRET || "supersecretkey123",
//       { expiresIn: "1d" },
//     );

//     delete user.password;
//     console.log("User logged in:", user.name);
//     res.status(200).json({ token, user, url: userRes.url });
//   } catch (err) {
//     await client.query("ROLLBACK");
//     res.status(500).json({ message: "Internal Server Error!" });
//     next(err);
//   }
// };

export const logout = async (req:Request, res:Response) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
}

