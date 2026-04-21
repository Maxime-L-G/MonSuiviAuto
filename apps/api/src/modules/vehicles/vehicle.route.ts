import { Router } from "express"
import * as controller from "./vehicle.controller"
import { requireAuth } from "../../middleware/requireAuth"

export const vehicleRouter = Router()

vehicleRouter.post("/", requireAuth, controller.create)
vehicleRouter.get("/", requireAuth, controller.list)
vehicleRouter.get("/archived", requireAuth, controller.listArchived)
vehicleRouter.get("/:id", requireAuth, controller.getOne)
vehicleRouter.patch("/:id", requireAuth, controller.update)
vehicleRouter.patch("/:id/archive", requireAuth, controller.archive)
vehicleRouter.delete("/:id", requireAuth, controller.remove)



