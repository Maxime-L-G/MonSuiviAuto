import { Router } from "express"
import { requireAuth } from "../../middleware/requireAuth"
import * as controller from "./reminder.controller"

export const reminderRouter = Router()

reminderRouter.get("/vehicles/:vehicleId/reminders", requireAuth, controller.listForVehicle)
reminderRouter.post("/vehicles/:vehicleId/reminders", requireAuth, controller.createForVehicle)

reminderRouter.patch("/reminders/:id", requireAuth, controller.updateOne)
reminderRouter.delete("/reminders/:id", requireAuth, controller.remove)

reminderRouter.get("/reminders/upcoming", requireAuth, controller.upcoming)
