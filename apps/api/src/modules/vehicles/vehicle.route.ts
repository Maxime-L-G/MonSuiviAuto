import { Router } from "express"
import * as controller from "./vehicle.controller"
import { requireAuth } from "../../middleware/requireAuth"

export const vehicleRouter = Router()

vehicleRouter.post("/", requireAuth, controller.create)
vehicleRouter.get("/", requireAuth, controller.list)
vehicleRouter.patch("/:id", requireAuth, controller.update)
vehicleRouter.delete("/:id", requireAuth, controller.remove)

