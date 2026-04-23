import { Router } from "express"
import { requireAuth } from "../../middleware/requireAuth"
import { requireAdmin } from "../../middleware/requireAdmin"
import * as controller from "./admin.controller"

export const adminRouter = Router()

adminRouter.get("/users", requireAuth, requireAdmin, controller.listUsers)
