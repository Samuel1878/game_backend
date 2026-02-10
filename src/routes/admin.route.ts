import { getDeposits, updateDeposit } from "@/controllers/tran.controller.js";
import { getUsers } from "@/controllers/user.controller.js";
import { Router } from "express";


const router = Router();
router.get("/", (req, res) => {
  res.send("Admin route");
});
router.get("/users", getUsers);
router.get("/get_deposits", getDeposits);
router.put("/update_deposit", updateDeposit)
export default router;