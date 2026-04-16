import { Router } from "express"
import { requireAuth } from "../../middleware/requireAuth"
import * as controller from "./maintenance.controller"

export const maintenanceRouter = Router()

maintenanceRouter.get("/vehicles/:vehicleId/maintenances", requireAuth, controller.list)
maintenanceRouter.post("/vehicles/:vehicleId/maintenances", requireAuth, controller.create)

maintenanceRouter.patch("/maintenances/:id", requireAuth, controller.update)
maintenanceRouter.delete("/maintenances/:id", requireAuth, controller.remove)
