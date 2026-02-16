import { Login, Register } from "../controllers/auth.controller.js";
import { Router } from "express";
const router = Router();
router.get("/", (req, res, next) => {
    res.send("AUTH route");
    next();
});
router.post("/register", Register);
router.post("/login", Login);
export default router;
//# sourceMappingURL=auth.route.js.map