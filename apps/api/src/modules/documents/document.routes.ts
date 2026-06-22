import { Router } from "express"
import { requireAuth } from "../../middleware/requireAuth"
import { upload } from "../../config/upload"
import * as controller from "./document.controller"

export const documentRouter = Router()

documentRouter.get("/vehicles/:vehicleId/documents", requireAuth, controller.list)
documentRouter.post(
  "/vehicles/:vehicleId/documents",
  requireAuth,
  upload.single("file"),
  controller.create
)
documentRouter.get("/documents/:id/download", requireAuth, controller.download)
documentRouter.delete("/documents/:id", requireAuth, controller.remove)
