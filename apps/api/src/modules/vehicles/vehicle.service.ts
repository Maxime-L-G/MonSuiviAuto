import { VehicleUsage } from "@prisma/client"
import * as repo from "./vehicle.repository"

export async function createVehicle(
  userId: string,
  data: { make: string; model: string; year: number; currentKm: number; usage?: VehicleUsage }
) {
  return repo.dbCreateVehicle(userId, data)
}

export async function listVehicles(userId: string) {
  return repo.dbListVehicles(userId)
}

export async function getVehicleById(id: string, userId: string) {
  return repo.dbGetVehicleById(id, userId)
}

export async function updateVehicle(
  id: string,
  userId: string,
  data: { make?: string; model?: string; year?: number; currentKm?: number; usage?: VehicleUsage }
) {
  const result = await repo.dbUpdateVehicle(id, userId, data)
  return result.count > 0
}

export async function deleteVehicle(id: string, userId: string) {
  const result = await repo.dbDeleteVehicle(id, userId)
  return result.count > 0
}

export async function archiveVehicle(id: string, userId: string) {
  const result = await repo.dbArchiveVehicle(id, userId)
  return result.count > 0
}
