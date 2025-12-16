import "dotenv/config"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import { authRouter } from "./modules/auth/auth.routes"
import { vehicleRouter } from "./modules/vehicles/vehicle.route"

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.get("/health", (_, res) => res.json({ status: "OK", app: "MonSuiviAuto API" }))

app.use("/auth", authRouter)

app.use("/vehicles", vehicleRouter)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
