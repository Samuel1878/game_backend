import { createAgent, deleteAgent, getAgents, updateAgent } from "../controllers/admin.controller.js";
import { getDeposits, getWithdrawals, updateDeposit, updateWithdrawals } from "../controllers/tran.controller.js";
import { getUsers } from "../controllers/user.controller.js";
import { Router } from "express";


const router = Router();
router.get("/", (req, res) => {
  res.send("Admin route");
});
router.get("/users", getUsers);
router.get("/get_deposits", getDeposits);
router.put("/update_deposit", updateDeposit);
router.get("/get_withdrawals", getWithdrawals);
router.put("/update_withdrawals", updateWithdrawals);

//Agent CRUD
router.post("/create_agent",createAgent);
router.get("/get_agent", getAgents);
router.put("/update_agent", updateAgent);
router.post("/delete",deleteAgent )
export default router;