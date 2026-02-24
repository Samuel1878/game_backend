import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mountRoutes from "./routes/index.route.js";
import { initSocket } from "./middleware/socket.js";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { pool } from "./config/db.config.js";
import cookieParser from "cookie-parser";

const PgStore = pgSession(session);


export const app = express();
const server = createServer(app);
const sessionMiddleware = session({
    store: new PgStore({
      pool: pool,
      tableName: "session",
      createTableIfMissing: true,                
    }),
    secret: process.env.SESSION_SECRET || "iamYourDad",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure:false, 
      maxAge: 1000 * 60 * 60 // 1 hr
    },
  })
// Middlewares
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sessionMiddleware);

app.get("/", (_req, res) => {
  res.send("Express server with TypeScript!");
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// Mount API routes
mountRoutes(app);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
io.use((socket, next) => {
  sessionMiddleware(socket.request as any, {} as any, next as any);
});

initSocket(io);

export default server;