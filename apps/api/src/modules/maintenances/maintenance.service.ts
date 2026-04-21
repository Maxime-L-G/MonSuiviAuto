import { MaintenanceType, ReminderType } from "@prisma/client"
import * as repo from "./maintenance.repository"
import { dbCreateReminder } from "../reminders/reminder.repository"

type AutoReminderRule = {
  reminderType: ReminderType
  title: string
  daysInterval?: number
  kmInterval?: number
}

const AUTO_REMINDER_RULES: Partial<Record<MaintenanceType, AutoReminderRule>> = {
  OIL_CHANGE:  { reminderType: "OIL_CHANGE",  title: "Prochaine vidange",              daysInterval: 365,  kmInterval: 10000 },
  INSPECTION:  { reminderType: "INSPECTION",   title: "Prochain contrôle technique",    daysInterval: 730 },
  TIRES:       { reminderType: "CUSTOM",       title: "Remplacement des pneus",         daysInterval: 730,  kmInterval: 30000 },
  BRAKES:      { reminderType: "CUSTOM",       title: "Vérification des freins",        daysInterval: 730,  kmInterval: 30000 },
  BATTERY:     { reminderType: "CUSTOM",       title: "Remplacement de la batterie",    daysInterval: 1460 },
}

export async function listMaintenances(userId: string, vehicleId: string) {
  const vehicle = await repo.dbFindVehicleOwned(vehicleId, userId)
  if (!vehicle) return null

  return repo.dbListMaintenances(vehicleId)
}

export async function createMaintenance(
  userId: string,
  vehicleId: string,
  data: {
    type?: MaintenanceType
    title: string
    date: Date
    mileage: number
    costCents?: number
    notes?: string
  }
) {
  const vehicle = await repo.dbFindVehicleOwned(vehicleId, userId)
  if (!vehicle) return null

  const maintenance = await repo.dbCreateMaintenance(vehicleId, {
    type: data.type ?? "OTHER",
    title: data.title,
    date: data.date,
    mileage: data.mileage,
    costCents: data.costCents ?? 0,
    notes: data.notes,
  })

  const rule = AUTO_REMINDER_RULES[maintenance.type]
  if (rule) {
    const dueDate = rule.daysInterval
      ? new Date(data.date.getTime() + rule.daysInterval * 24 * 60 * 60 * 1000)
      : undefined
    const dueMileage = rule.kmInterval ? data.mileage + rule.kmInterval : undefined

    await dbCreateReminder(vehicleId, {
      type: rule.reminderType,
      title: rule.title,
      dueDate,
      dueMileage,
    })
  }

  return maintenance
}

export async function updateMaintenance(
  userId: string,
  id: string,
  data: {
    type?: MaintenanceType
    title?: string
    date?: Date
    mileage?: number
    costCents?: number
    notes?: string | null
  }
) {
  const m = await repo.dbFindMaintenance(id, userId)
  if (!m) return null

  return repo.dbUpdateMaintenance(id, data)
}

export async function deleteMaintenance(userId: string, id: string) {
  const m = await repo.dbFindMaintenance(id, userId)
  if (!m) return null

  await repo.dbDeleteMaintenance(id)
  return true
}
