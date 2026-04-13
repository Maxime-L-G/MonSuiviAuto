import { prisma } from "../../config/prisma"

async function ensureVehicleOwned(userId: string, vehicleId: string) {
  const v = await prisma.vehicle.findFirst({
    where: { id: vehicleId, userId },
    select: { id: true },
  })
  return !!v
}

export async function listVehicleReminders(userId: string, vehicleId: string) {
  const ok = await ensureVehicleOwned(userId, vehicleId)
  if (!ok) return null

  return prisma.reminder.findMany({
    where: { vehicleId },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }, { dueMileage: "asc" }, { createdAt: "desc" }],
  })
}

export async function createVehicleReminder(
  userId: string,
  vehicleId: string,
  data: {
    type?: "INSPECTION" | "INSURANCE" | "OIL_CHANGE" | "CUSTOM"
    title: string
    dueDate?: Date
    dueMileage?: number
    notes?: string
  }
) {
  const ok = await ensureVehicleOwned(userId, vehicleId)
  if (!ok) return null

  return prisma.reminder.create({
    data: {
      vehicleId,
      type: data.type ?? "CUSTOM",
      title: data.title,
      dueDate: data.dueDate,
      dueMileage: data.dueMileage,
      notes: data.notes,
    },
  })
}

type UpdateReminderData = {
  status?: "OPEN" | "DONE"
  title?: string
  dueDate?: Date | null
  dueMileage?: number | null
  notes?: string | null
}

export async function updateReminder(userId: string, id: string, data: UpdateReminderData) {
  const r = await prisma.reminder.findFirst({
    where: { id, vehicle: { userId } },
    select: { id: true },
  })
  if (!r) return null

  return prisma.reminder.update({
    where: { id },
    data,
  })
}

export async function deleteReminder(userId: string, id: string) {
  const r = await prisma.reminder.findFirst({
    where: { id, vehicle: { userId } },
    select: { id: true },
  })
  if (!r) return null

  await prisma.reminder.delete({ where: { id } })
  return true
}

export async function listUpcomingReminders(userId: string) {
  // V1: uniquement dueDate (simple)
  const now = new Date()
  const in30 = new Date(now)
  in30.setDate(in30.getDate() + 30)

  return prisma.reminder.findMany({
    where: {
      status: "OPEN",
      vehicle: { userId },
      dueDate: { gte: now, lte: in30 },
    },
    include: {
      vehicle: { select: { id: true, make: true, model: true } },
    },
    orderBy: { dueDate: "asc" },
    take: 10,
  })
}
