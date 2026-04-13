import { Request, Response } from "express"
import { createReminderSchema, updateReminderSchema } from "./reminder.schema"
import * as service from "./reminder.service"

export async function listForVehicle(req: Request, res: Response) {
  const userId = (req as any).user.id as string
  const { vehicleId } = req.params

  const reminders = await service.listVehicleReminders(userId, vehicleId)
  if (!reminders) return res.status(404).json({ error: "VEHICLE_NOT_FOUND" })

  return res.json({ reminders })
}

export async function createForVehicle(req: Request, res: Response) {
  const userId = (req as any).user.id as string
  const { vehicleId } = req.params

  const parsed = createReminderSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() })
  }

  const created = await service.createVehicleReminder(userId, vehicleId, {
    ...parsed.data,
    dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
  })

  if (!created) return res.status(404).json({ error: "VEHICLE_NOT_FOUND" })
  return res.status(201).json({ reminder: created })
}

export async function updateOne(req: Request, res: Response) {
  const userId = (req as any).user.id as string
  const { id } = req.params

  const parsed = updateReminderSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: "VALIDATION_ERROR" })

  const updated = await service.updateReminder(userId, id, {
    ...parsed.data,
    dueDate: parsed.data.dueDate === undefined ? undefined :
      parsed.data.dueDate === null ? null : new Date(parsed.data.dueDate),
  })

  if (!updated) return res.status(404).json({ error: "REMINDER_NOT_FOUND" })
  return res.json({ reminder: updated })
}

export async function remove(req: Request, res: Response) {
  const userId = (req as any).user.id as string
  const { id } = req.params

  const ok = await service.deleteReminder(userId, id)
  if (!ok) return res.status(404).json({ error: "REMINDER_NOT_FOUND" })

  return res.status(204).send()
}

export async function upcoming(req: Request, res: Response) {
  const userId = (req as any).user.id as string
  const reminders = await service.listUpcomingReminders(userId)
  return res.json({ reminders })
}
