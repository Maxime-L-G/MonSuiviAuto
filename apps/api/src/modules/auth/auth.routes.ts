import { Router } from "express"
import * as controller from "./auth.controller"
import { me } from "./auth.me"
import { requireAuth } from "../../middleware/requireAuth"

export const authRouter = Router()

authRouter.post("/register", controller.register)
authRouter.post("/login", controller.login)
authRouter.get("/me", requireAuth, me)
