import { Request, Response } from "express"
import * as service from "./garages.service"

export async function list(req: Request, res: Response) {
  const lat = Number(req.query.lat)
  const lon = Number(req.query.lon)

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return res.status(400).json({ error: "INVALID_COORDINATES" })
  }

  try {
    const garages = await service.findNearbyGarages(lat, lon)
    return res.json({ garages })
  } catch {
    return res.status(503).json({ error: "GARAGES_SERVICE_UNAVAILABLE" })
  }
}
