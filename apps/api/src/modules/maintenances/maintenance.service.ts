import { MaintenanceType } from "@prisma/client"
import * as repo from "./maintenance.repository"

export async function listMaintenances(userId: string, vehicleId: string) {
  const vehicle = await repo.dbFindVehicleOwned(vehicleId, userId)
  if (!vehicle) return null

  return repo.dbListMaintenances(vehicleId)
}

export async function createMaintenance(
  userId: string,
  vehicleId: string,
  data: {
    type?: MaintenanceType
    title: string
    date: Date
    mileage: number
    costCents?: number
    notes?: string
  }
) {
  const vehicle = await repo.dbFindVehicleOwned(vehicleId, userId)
  if (!vehicle) return null

  return repo.dbCreateMaintenance(vehicleId, {
    type: data.type ?? "OTHER",
    title: data.title,
    date: data.date,
    mileage: data.mileage,
    costCents: data.costCents ?? 0,
    notes: data.notes,
  })
}

export async function updateMaintenance(
  userId: string,
  id: string,
  data: {
    type?: MaintenanceType
    title?: string
    date?: Date
    mileage?: number
    costCents?: number
    notes?: string | null
  }
) {
  const m = await repo.dbFindMaintenance(id, userId)
  if (!m) return null

  return repo.dbUpdateMaintenance(id, data)
}

export async function deleteMaintenance(userId: string, id: string) {
  const m = await repo.dbFindMaintenance(id, userId)
  if (!m) return null

  await repo.dbDeleteMaintenance(id)
  return true
}
