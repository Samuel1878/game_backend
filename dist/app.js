var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import mountRoutes from './routes/index.route.js';
dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
mountRoutes(app);
app.get('/', (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const data = await pool.query('SELECT * FROM users');
    // console.log(data)
    res.send('Express server with TypeScript!');
    next();
}));
app.use((err, _req, res, next) => {
    res.status(400).send(err.message || "An error occurred");
});
export default app;
//# sourceMappingURL=app.js.map