
// import { app } from "../app.js";
// import type { NextFunction, Request, Response } from "express";

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));

// app.get("/", (_req: Request, res: Response) => {
//   res.send("Express server with TypeScript!");
// });
// app.get("/health", (_req, res) => {
//   res.json({
//     status: "ok",
//     uptime: process.uptime(),
//     timestamp: Date.now(),
//   });
// });
// app.use((_req: Request, res: Response) => {
//   res.status(404).json({ message: "Route not found" });
// });

// app.use(
//   (err: Error, _req: Request, res: Response, _next: NextFunction) => {
//     console.error(err);

//     res.status(400).json({
//       success: false,
//       message: err.message || "An error occurred",
//     });
//   }
// );
