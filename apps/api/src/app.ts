import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./config/swagger"
import { authRouter } from "./modules/auth/auth.routes"
import { vehicleRouter } from "./modules/vehicles/vehicle.route"
import { maintenanceRouter } from "./modules/maintenances/maintenance.routes"
import { dashboardRouter } from "./modules/dashboard/dashboard.routes"
import { reminderRouter } from "./modules/reminders/reminder.routes"
import { adminRouter } from "./modules/admin/admin.routes"
import { documentRouter } from "./modules/documents/document.routes"
import { garagesRouter } from "./modules/garages/garages.routes"

export function createApp() {
  const app = express()

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: "TOO_MANY_REQUESTS" },
  })

  const frontendUrl = process.env.FRONTEND_URL
  app.use(cors({ origin: frontendUrl || true }))
  app.use(helmet())
  app.use(express.json())

  app.get("/health", (_, res) => res.json({ status: "OK", app: "MonSuiviAuto API" }))

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  app.use("/auth", authLimiter, authRouter)

  app.use("/vehicles", vehicleRouter)
  app.use(maintenanceRouter)
  app.use(dashboardRouter)
  app.use(reminderRouter)
  app.use("/admin", adminRouter)
  app.use(documentRouter)
  app.use(garagesRouter)

  return app
}
