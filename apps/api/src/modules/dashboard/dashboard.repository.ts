import { prisma } from "../../config/prisma"

export async function dbCountVehicles(userId: string) {
  return prisma.vehicle.count({ where: { userId } })
}

export async function dbSumMaintenanceCosts(userId: string, from: Date) {
  const result = await prisma.maintenance.aggregate({
    where: { vehicle: { userId }, date: { gte: from } },
    _sum: { costCents: true },
  })
  return result._sum.costCents ?? 0
}

export async function dbListUpcomingReminders(userId: string, from: Date, to: Date) {
  return prisma.reminder.findMany({
    where: {
      status: "OPEN",
      vehicle: { userId },
      dueDate: { gte: from, lte: to },
    },
    include: { vehicle: { select: { id: true, make: true, model: true } } },
    orderBy: { dueDate: "asc" },
    take: 5,
  })
}
