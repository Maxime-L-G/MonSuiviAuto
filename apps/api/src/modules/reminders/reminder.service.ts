import { ReminderType, ReminderStatus } from "@prisma/client"
import * as repo from "./reminder.repository"

export async function listVehicleReminders(userId: string, vehicleId: string) {
  const vehicle = await repo.dbFindVehicleOwned(vehicleId, userId)
  if (!vehicle) return null

  return repo.dbListReminders(vehicleId)
}

export async function createVehicleReminder(
  userId: string,
  vehicleId: string,
  data: {
    type?: ReminderType
    title: string
    dueDate?: Date
    dueMileage?: number
    notes?: string
  }
) {
  const vehicle = await repo.dbFindVehicleOwned(vehicleId, userId)
  if (!vehicle) return null

  return repo.dbCreateReminder(vehicleId, {
    type: data.type ?? "CUSTOM",
    title: data.title,
    dueDate: data.dueDate,
    dueMileage: data.dueMileage,
    notes: data.notes,
  })
}

export async function updateReminder(
  userId: string,
  id: string,
  data: {
    status?: ReminderStatus
    title?: string
    dueDate?: Date | null
    dueMileage?: number | null
    notes?: string | null
  }
) {
  const r = await repo.dbFindReminder(id, userId)
  if (!r) return null

  return repo.dbUpdateReminder(id, data)
}

export async function deleteReminder(userId: string, id: string) {
  const r = await repo.dbFindReminder(id, userId)
  if (!r) return null

  await repo.dbDeleteReminder(id)
  return true
}

export async function listUpcomingReminders(userId: string) {
  const now = new Date()
  const in30Days = new Date(now)
  in30Days.setDate(in30Days.getDate() + 30)

  return repo.dbListUpcomingReminders(userId, now, in30Days)
}
