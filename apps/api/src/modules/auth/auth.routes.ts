import { Router } from "express"
import { requireAuth } from "../../middleware/requireAuth"
import * as controller from "./auth.controller"

export const authRouter = Router()

authRouter.post("/register", controller.register)
authRouter.post("/login", controller.login)
authRouter.get("/me", requireAuth, controller.getMe)
