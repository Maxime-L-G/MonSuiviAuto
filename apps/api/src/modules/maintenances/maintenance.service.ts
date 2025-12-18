import { prisma } from "../../config/prisma"

export async function listMaintenances(userId: string, vehicleId: string) {
  // ownership: vehicle must belong to user
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId, userId },
    select: { id: true },
  })
  if (!vehicle) return null

  const maintenances = await prisma.maintenance.findMany({
    where: { vehicleId },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  })

  return maintenances
}

export async function createMaintenance(
  userId: string,
  vehicleId: string,
  data: {
    type?: any
    title: string
    date: Date
    mileage: number
    costCents?: number
    notes?: string
  }
) {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId, userId },
    select: { id: true },
  })
  if (!vehicle) return null

  return prisma.maintenance.create({
    data: {
      vehicleId,
      type: data.type ?? "OTHER",
      title: data.title,
      date: data.date,
      mileage: data.mileage,
      costCents: data.costCents ?? 0,
      notes: data.notes,
    },
  })
}

export async function deleteMaintenance(userId: string, id: string) {
  const m = await prisma.maintenance.findFirst({
    where: { id, vehicle: { userId } },
    select: { id: true },
  })
  if (!m) return null

  await prisma.maintenance.delete({ where: { id } })
  return true
}
