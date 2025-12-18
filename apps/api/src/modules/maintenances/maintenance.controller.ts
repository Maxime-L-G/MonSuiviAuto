import { Request, Response } from "express"
import { createMaintenanceSchema } from "./maintenance.schema"
import * as service from "./maintenance.service"

export async function list(req: Request, res: Response) {
  const userId = (req as any).user.id as string
  const { vehicleId } = req.params

  const maintenances = await service.listMaintenances(userId, vehicleId)
  if (!maintenances) return res.status(404).json({ error: "VEHICLE_NOT_FOUND" })

  return res.json({ maintenances })
}

export async function create(req: Request, res: Response) {
  const userId = (req as any).user.id as string
  const { vehicleId } = req.params

  const parsed = createMaintenanceSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() })
  }

  const created = await service.createMaintenance(userId, vehicleId, {
    ...parsed.data,
    date: new Date(parsed.data.date),
  })

  if (!created) return res.status(404).json({ error: "VEHICLE_NOT_FOUND" })

  return res.status(201).json({ maintenance: created })
}

export async function remove(req: Request, res: Response) {
  const userId = (req as any).user.id as string
  const { id } = req.params

  const ok = await service.deleteMaintenance(userId, id)
  if (!ok) return res.status(404).json({ error: "MAINTENANCE_NOT_FOUND" })

  return res.status(204).send()
}
