import { prisma } from "../../config/prisma"
import { MaintenanceType } from "@prisma/client"

export async function dbFindVehicleOwned(vehicleId: string, userId: string) {
  return prisma.vehicle.findFirst({
    where: { id: vehicleId, userId },
    select: { id: true },
  })
}

export async function dbListMaintenances(vehicleId: string) {
  return prisma.maintenance.findMany({
    where: { vehicleId },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  })
}

export async function dbCreateMaintenance(
  vehicleId: string,
  data: {
    type: MaintenanceType
    title: string
    date: Date
    mileage: number
    costCents: number
    notes?: string
  }
) {
  return prisma.maintenance.create({ data: { vehicleId, ...data } })
}

export async function dbFindMaintenance(id: string, userId: string) {
  return prisma.maintenance.findFirst({
    where: { id, vehicle: { userId } },
    select: { id: true },
  })
}

export async function dbDeleteMaintenance(id: string) {
  return prisma.maintenance.delete({ where: { id } })
}
