import { Register } from "@/controllers/user.controller.js";
import { Router } from "express";
const router = Router();
router.get("/", (req, res) => {
    res.send("User route");
});
router.post("/register", Register);
export default router;
//# sourceMappingURL=user.route.js.map