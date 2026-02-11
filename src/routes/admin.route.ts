import { getDeposits, getWithdrawals, updateDeposit, updateWithdrawals } from "@/controllers/tran.controller.js";
import { getUsers } from "@/controllers/user.controller.js";
import { Router } from "express";


const router = Router();
router.get("/", (req, res) => {
  res.send("Admin route");
});
router.get("/users", getUsers);
router.get("/get_deposits", getDeposits);
router.put("/update_deposit", updateDeposit);
router.get("/get_withdrawals", getWithdrawals);
router.put("/update_withdrawals", updateWithdrawals)
export default router;