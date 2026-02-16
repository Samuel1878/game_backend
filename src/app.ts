import express from 'express';
import type {Application, NextFunction, Request, Response} from "express"
import cors from "cors";
import dotenv from "dotenv";
import mountRoutes from './routes/index.route.js';

dotenv.config();
const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
mountRoutes(app)

app.get('/', async(_req: Request, res: Response, next: NextFunction) => {
    // const data = await pool.query('SELECT * FROM users');
    // console.log(data)
  res.send('Express server with TypeScript!');
  next();
});


app.use((err:Error, _req: Request, res: Response, next: any) => {
  res.status(400).send(err.message || "An error occurred");
})
export default app;  