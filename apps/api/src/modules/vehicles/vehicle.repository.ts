import { prisma } from "../../config/prisma"
import { VehicleUsage } from "@prisma/client"

export async function dbCreateVehicle(
  userId: string,
  data: { make: string; model: string; year: number; currentKm: number; usage?: VehicleUsage }
) {
  return prisma.vehicle.create({ data: { ...data, userId } })
}

export async function dbListVehicles(userId: string) {
  return prisma.vehicle.findMany({
    where: { userId, archivedAt: null },
    orderBy: { createdAt: "desc" },
  })
}

export async function dbListArchivedVehicles(userId: string) {
  return prisma.vehicle.findMany({
    where: { userId, archivedAt: { not: null } },
    orderBy: { archivedAt: "desc" },
  })
}

export async function dbArchiveVehicle(id: string, userId: string) {
  return prisma.vehicle.updateMany({
    where: { id, userId, archivedAt: null },
    data: { archivedAt: new Date() },
  })
}

export async function dbGetVehicleById(id: string, userId: string) {
  return prisma.vehicle.findFirst({ where: { id, userId } })
}

export async function dbUpdateVehicle(
  id: string,
  userId: string,
  data: { make?: string; model?: string; year?: number; currentKm?: number; usage?: VehicleUsage }
) {
  return prisma.vehicle.updateMany({ where: { id, userId }, data })
}

export async function dbDeleteVehicle(id: string, userId: string) {
  return prisma.vehicle.deleteMany({ where: { id, userId } })
}
