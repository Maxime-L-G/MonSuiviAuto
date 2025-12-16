import { Request, Response } from "express"
import { createVehicleSchema } from "./vehicle.schema"
import * as service from "./vehicle.service"

export async function create(req: Request, res: Response) {
  const userId = (req as any).user.id as string

  const parsed = createVehicleSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() })
  }

  const vehicle = await service.createVehicle(userId, parsed.data)
  return res.status(201).json({ vehicle })
}

export async function list(req: Request, res: Response) {
  const userId = (req as any).user.id as string
  const vehicles = await service.listVehicles(userId)
  return res.json({ vehicles })
}
