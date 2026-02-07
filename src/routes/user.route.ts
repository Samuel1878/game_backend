
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("User route");
});


// router.post("/get-user", Register
// );
export default router;