import "dotenv/config"
import { createApp } from "./app"
import { connectMongo } from "./config/mongo"

void connectMongo()

const app = createApp()

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
