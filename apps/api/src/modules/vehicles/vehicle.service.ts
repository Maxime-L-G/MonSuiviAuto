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

export async function updateVehicle(
  id: string,
  userId: string,
  data: {
    make: string
    model: string
    year: number
    currentKm: number
  }
) {
  return prisma.vehicle.updateMany({
    where: {
      id,
      userId, // 🔒 ownership
    },
    data,
  })
}

export async function deleteVehicle(id: string, userId: string) {
  return prisma.vehicle.deleteMany({
    where: {
      id,
      userId, // 🔒 ownership
    },
  })
}

