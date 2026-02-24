import { login,logout,Register} from "../controllers/auth.controller.js";

import { Router } from "express";

const router = Router();

router.get("/", (req, res,next) => {
  res.send("AUTH route");
  next();
});


router.post("/register", Register);
router.post("/login", login);
router.post("/logout", logout)
export default router;