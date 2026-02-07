import { Router } from "express";
import { getGameList } from "../controllers/game.controller.js";
const router = Router();
router.get("/game_list", getGameList);
export default router;
//# sourceMappingURL=game.route.js.map