import { prisma } from "../../config/prisma"

export async function createVehicle(
  userId: string,
  data: {
    make: string
    model: string
    year: number
    currentKm: number
  }
) {
  return prisma.vehicle.create({
    data: {
      ...data,
      userId,
    },
  })
}

export async function listVehicles(userId: string) {
  return prisma.vehicle.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
}
