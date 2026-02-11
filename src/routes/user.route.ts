
import { createWithdraw, deposit } from "@/controllers/tran.controller.js";
import { getUserBallance } from "@/controllers/user.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("User route");
});
router.get("/profile", (req, res) => {
  res.send("User profile");
}); 
router.get("/balance", getUserBallance)
router.get("/settings", (req, res) => {
  res.send("User settings");
});
router.get("/history", (req, res) => {
  res.send("User history");
});

router.post("/transaction/deposit", deposit);


router.post("/transaction/withdraw",createWithdraw);

// router.post("/get-user", Register
// );
export default router;