import auth from "@/routes/auth.route.js";
import game from "@/routes/game.route.js";
import user from "@/routes/user.route.js";
import admin from "@/routes/admin.route.js";
import type { Application } from "express";
const api = `/api/v${process.env.VERSION ||"1"}`;
const mountRoutes = (app:Application) => {
  app.use(`${api}/user`, user)
  app.use(`${api}/game`, game)
  app.use(`${api}/auth`, auth)
  app.use(`${api}/admin`, admin) // For now, admin routes are protected by auth middleware. You can replace it with an actual admin middleware later.
  
}
export default mountRoutes