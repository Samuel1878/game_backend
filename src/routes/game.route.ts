import { Router } from "express";
import { getGameByGpId, getGameList } from "../controllers/game.controller.js";


const router = Router();

router.get("/game_list", getGameList);
router.get("/get_game_gpid", getGameByGpId)
export default router;