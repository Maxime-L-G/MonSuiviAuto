import { prisma } from "../../config/prisma"

export async function dbCreateVehicle(
  userId: string,
  data: { make: string; model: string; year: number; currentKm: number }
) {
  return prisma.vehicle.create({ data: { ...data, userId } })
}

export async function dbListVehicles(userId: string) {
  return prisma.vehicle.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
}

export async function dbGetVehicleById(id: string, userId: string) {
  return prisma.vehicle.findFirst({ where: { id, userId } })
}

export async function dbUpdateVehicle(
  id: string,
  userId: string,
  data: { make: string; model: string; year: number; currentKm: number }
) {
  return prisma.vehicle.updateMany({ where: { id, userId }, data })
}

export async function dbDeleteVehicle(id: string, userId: string) {
  return prisma.vehicle.deleteMany({ where: { id, userId } })
}
