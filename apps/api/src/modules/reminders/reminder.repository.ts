import { prisma } from "../../config/prisma"
import { ReminderType, ReminderStatus } from "@prisma/client"

export async function dbFindVehicleOwned(vehicleId: string, userId: string) {
  return prisma.vehicle.findFirst({
    where: { id: vehicleId, userId },
    select: { id: true },
  })
}

export async function dbListReminders(vehicleId: string) {
  return prisma.reminder.findMany({
    where: { vehicleId },
    orderBy: [
      { status: "asc" },
      { dueDate: "asc" },
      { dueMileage: "asc" },
      { createdAt: "desc" },
    ],
  })
}

export async function dbCreateReminder(
  vehicleId: string,
  data: {
    type: ReminderType
    title: string
    dueDate?: Date
    dueMileage?: number
    notes?: string
  }
) {
  return prisma.reminder.create({ data: { vehicleId, ...data } })
}

export async function dbFindReminder(id: string, userId: string) {
  return prisma.reminder.findFirst({
    where: { id, vehicle: { userId } },
    select: { id: true },
  })
}

export async function dbUpdateReminder(
  id: string,
  data: {
    status?: ReminderStatus
    title?: string
    dueDate?: Date | null
    dueMileage?: number | null
    notes?: string | null
  }
) {
  return prisma.reminder.update({ where: { id }, data })
}

export async function dbDeleteReminder(id: string) {
  return prisma.reminder.delete({ where: { id } })
}

export async function dbListUpcomingReminders(userId: string, from: Date, to: Date) {
  return prisma.reminder.findMany({
    where: {
      status: "OPEN",
      vehicle: { userId },
      dueDate: { gte: from, lte: to },
    },
    include: {
      vehicle: { select: { id: true, make: true, model: true } },
    },
    orderBy: { dueDate: "asc" },
    take: 10,
  })
}
