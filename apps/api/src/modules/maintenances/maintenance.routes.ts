import { Router } from "express"
import { requireAuth } from "../../middleware/requireAuth"
import * as controller from "./maintenance.controller"

export const maintenanceRouter = Router()

// nested under vehicle
maintenanceRouter.get("/vehicles/:vehicleId/maintenances", requireAuth, controller.list)
maintenanceRouter.post("/vehicles/:vehicleId/maintenances", requireAuth, controller.create)

// direct maintenance id
maintenanceRouter.delete("/maintenances/:id", requireAuth, controller.remove)
