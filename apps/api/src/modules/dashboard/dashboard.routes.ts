import { Router } from "express"
import { requireAuth } from "../../middleware/requireAuth"
import * as controller from "./dashboard.controller"

export const dashboardRouter = Router()

dashboardRouter.get("/dashboard/summary", requireAuth, controller.getSummary)
