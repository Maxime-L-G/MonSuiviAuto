import { prisma } from "../../config/prisma"

export async function dbFindVehicleOwned(vehicleId: string, userId: string) {
  return prisma.vehicle.findFirst({ where: { id: vehicleId, userId }, select: { id: true } })
}

export async function dbListDocuments(vehicleId: string) {
  return prisma.document.findMany({
    where: { vehicleId },
    orderBy: { createdAt: "desc" },
  })
}

export async function dbCreateDocument(
  vehicleId: string,
  data: { filename: string; originalName: string; mimeType: string; sizeBytes: number }
) {
  return prisma.document.create({ data: { vehicleId, ...data } })
}

export async function dbFindDocument(id: string, userId: string) {
  return prisma.document.findFirst({
    where: { id, vehicle: { userId } },
  })
}

export async function dbDeleteDocument(id: string) {
  return prisma.document.delete({ where: { id } })
}
