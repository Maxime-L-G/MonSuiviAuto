import { VehicleUsage } from "@prisma/client"
import * as repo from "./vehicle.repository"
import { logAudit } from "../audit/audit.service"

export async function createVehicle(
  userId: string,
  data: { make: string; model: string; year: number; currentKm: number; usage?: VehicleUsage }
) {
  const vehicle = await repo.dbCreateVehicle(userId, data)
  await logAudit(userId, "CREATE", "VEHICLE", vehicle.id)
  return vehicle
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
  if (result.count > 0) await logAudit(userId, "UPDATE", "VEHICLE", id)
  return result.count > 0
}

export async function deleteVehicle(id: string, userId: string) {
  const result = await repo.dbDeleteVehicle(id, userId)
  if (result.count > 0) await logAudit(userId, "DELETE", "VEHICLE", id)
  return result.count > 0
}

export async function listArchivedVehicles(userId: string) {
  return repo.dbListArchivedVehicles(userId)
}

export async function archiveVehicle(id: string, userId: string) {
  const result = await repo.dbArchiveVehicle(id, userId)
  if (result.count > 0) await logAudit(userId, "UPDATE", "VEHICLE", id, { archived: true })
  return result.count > 0
}
