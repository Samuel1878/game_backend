import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import gameRoute from "./routes/game.route.js";
dotenv.config();
const app = express();
const PORT = 3000;
const api = `/api/v${process.env.VERSION || "1.0.0"}`;
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
// A simple GET route
app.get('/', (_req, res) => {
    res.send('Express server with TypeScript!');
});
app.use(`${api}/user`, userRoute);
;
app.use(`${api}/game`, gameRoute);
app.use((err, req, res, next) => {
    res.status(400).send(err.message || "An error occurred");
});
export default app;
//# sourceMappingURL=app.js.map