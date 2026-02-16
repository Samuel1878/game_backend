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
export const getUsers = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pool.query("SELECT * FROM users ORDER BY id ASC");
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});
// READ ONE
export const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (result.rows.length === 0)
            return res.status(404).json({ message: "User not found" });
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});
// UPDATE
export const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, email, phone, level, role } = req.body;
        const result = yield pool.query(`UPDATE users
       SET name = $1, email = $2, phone = $3, level = $4, role = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`, [name, email, phone, level, role, id]);
        if (result.rows.length === 0)
            return res.status(404).json({ message: "User not found" });
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});
// DELETE
export const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0)
            return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});
export const getUserBallance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.query;
        console.log(name);
        let data = JSON.stringify({
            "Username": name,
            "CompanyKey": "CB33E42BFAD04F90BA3B25F7EB257810",
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
            data: data
        };
        const response = yield axiosInstance.request(config);
        if (response.status === 200)
            return res.status(200).json(response.data);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
//# sourceMappingURL=user.controller.js.map