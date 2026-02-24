// middleware/auth.ts
import type { Request, Response, NextFunction } from "express";

export interface SessionRequest extends Request {
  session: any;
  userName?: string;
}

export const authenticate = (req: SessionRequest, res: Response, next: NextFunction) => {
  if (req.session.userName) {
    req.userName = req.session.userName;
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};