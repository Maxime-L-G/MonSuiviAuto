import { Request, Response } from "express"
import { createVehicleSchema, updateVehicleSchema } from "./vehicle.schema"
import * as service from "./vehicle.service"

export async function create(req: Request, res: Response) {
  const userId = req.user!.id

  const parsed = createVehicleSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() })
  }

  const vehicle = await service.createVehicle(userId, parsed.data)
  return res.status(201).json({ vehicle })
}

export async function list(req: Request, res: Response) {
  const userId = req.user!.id
  const vehicles = await service.listVehicles(userId)
  return res.json({ vehicles })
}

export async function update(req: Request, res: Response) {
  const userId = req.user!.id
  const { id } = req.params

  const parsed = updateVehicleSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() })
  }

  const ok = await service.updateVehicle(id, userId, parsed.data)
  if (!ok) return res.status(404).json({ error: "VEHICLE_NOT_FOUND" })

  return res.json({ success: true })
}

export async function remove(req: Request, res: Response) {
  const userId = req.user!.id
  const { id } = req.params

  const ok = await service.deleteVehicle(id, userId)
  if (!ok) return res.status(404).json({ error: "VEHICLE_NOT_FOUND" })

  return res.status(204).send()
}

export async function archive(req: Request, res: Response) {
  const userId = req.user!.id
  const { id } = req.params

  const ok = await service.archiveVehicle(id, userId)
  if (!ok) return res.status(404).json({ error: "VEHICLE_NOT_FOUND" })

  return res.status(204).send()
}

export async function getOne(req: Request, res: Response) {
  const userId = req.user!.id
  const { id } = req.params

  const vehicle = await service.getVehicleById(id, userId)
  if (!vehicle) return res.status(404).json({ error: "VEHICLE_NOT_FOUND" })

  return res.json({ vehicle })
}
