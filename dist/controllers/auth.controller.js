var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { axiosInstance } from "../config/api.js";
import { pool } from "../config/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const Register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    try {
        const { name, password } = req.body;
        yield client.query("BEGIN");
        // Check existing
        const exists = yield client.query("SELECT id FROM users WHERE name=$1", [
            name,
        ]);
        if (exists.rows.length) {
            yield client.query("ROLLBACK");
            return res.status(203).json({ message: "User already exists" });
        }
        const hashed = yield bcrypt.hash(password, 10);
        // Insert local user
        const result = yield client.query(`INSERT INTO users (name,password)
       VALUES ($1,$2)
       RETURNING *`, [name, hashed]);
        const user = yield result.rows[0];
        yield client.query(`INSERT INTO wallets (user_id, balance)
       VALUES ($1, 0)`, [user.id]);
        // External registration (retry once)
        try {
            yield axiosInstance
                .post("/web-root/restricted/player/register-player.aspx", {
                Username: name,
                UserGroup: "a",
                Agent: "AgentMM",
                CompanyKey: process.env.COMPANY_KEY || "CB33E42BFAD04F90BA3B25F7EB257810",
                ServerId: process.env.SERVER_ID || "test02",
            })
                .then((response) => {
                var _a, _b, _c;
                if (((_a = response.data) === null || _a === void 0 ? void 0 : _a.error) && ((_c = (_b = response.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.id) > 0) {
                    throw new Error("External API registration failed: " + response.data.message);
                }
                console.log("External registration successful for user:", name);
            })
                .catch((error) => {
                throw error;
            });
        }
        catch (apiError) {
            // Compensation: remove local user
            yield client.query("DELETE FROM users WHERE id=$1", [user.id]);
            yield client.query("ROLLBACK");
            return res.status(400).json({
                message: "External provider registration failed",
            });
        }
        // Commit DB
        yield client.query("COMMIT");
        // JWT
        const token = jwt.sign({ id: user.uid, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
        delete user.password;
        res.status(201).json({ token, user });
    }
    catch (err) {
        res.status(500).json({ message: "Registration failed", error: err });
        yield client.query("ROLLBACK");
        next(err);
    }
    finally {
        client.release();
    }
});
9;
export const Login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    try {
        const { name, password } = req.body;
        let userRes;
        const userResult = yield client.query("SELECT * FROM users WHERE name=$1", [
            name,
        ]);
        if (!userResult.rows.length)
            return res.status(401).json({ message: "Invalid credentials (name)" });
        const user = userResult.rows[0];
        const valid = yield bcrypt.compare(password, user.password);
        if (!valid)
            return res
                .status(401)
                .json({ message: "Invalid credentials (password)" });
        try {
            userRes = yield axiosInstance
                .post("/web-root/restricted/player/login.aspx", {
                IsWapSports: false,
                Username: user.name,
                Portfolio: "SeamlessGame",
                CompanyKey: process.env.COMPANY_KEY || "CB33E42BFAD04F90BA3B25F7EB257810",
                ServerId: process.env.SERVER_ID || "test01",
            })
                .then((response) => response.data)
                .catch((error) => {
                throw error;
            });
        }
        catch (apiError) {
            // Compensation: remove local user
            yield client.query("ROLLBACK");
            return res.status(502).json({
                message: "External provider registration failed",
            });
        }
        yield client.query("COMMIT");
        const token = jwt.sign({ id: user.uid, name: user.name }, process.env.JWT_SECRET || "supersecretkey123", { expiresIn: "1d" });
        delete user.password;
        console.log("User logged in:", user.name);
        res.status(200).json({ token, user, url: userRes.url });
    }
    catch (err) {
        yield client.query("ROLLBACK");
        res.status(500).json({ message: "Internal Server Error!" });
        next(err);
    }
});
//# sourceMappingURL=auth.controller.js.map