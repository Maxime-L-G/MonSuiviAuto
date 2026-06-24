import * as repo from "./document.repository"
import { cloudinary } from "../../config/cloudinary"
import { logAudit } from "../audit/audit.service"

export async function listDocuments(userId: string, vehicleId: string) {
  const vehicle = await repo.dbFindVehicleOwned(vehicleId, userId)
  if (!vehicle) return null

  return repo.dbListDocuments(vehicleId)
}

export async function createDocument(
  userId: string,
  vehicleId: string,
  file: { filename: string; path: string; originalname: string; mimetype: string; size: number }
) {
  const vehicle = await repo.dbFindVehicleOwned(vehicleId, userId)
  if (!vehicle) return null

  const document = await repo.dbCreateDocument(vehicleId, {
    filename: file.filename,
    url: file.path,
    originalName: file.originalname,
    mimeType: file.mimetype,
    sizeBytes: file.size,
  })

  await logAudit(userId, "CREATE", "DOCUMENT", document.id)
  return document
}

export async function getDocumentForDownload(userId: string, id: string) {
  const document = await repo.dbFindDocument(id, userId)
  if (!document) return null

  return document
}

export async function deleteDocument(userId: string, id: string) {
  const document = await repo.dbFindDocument(id, userId)
  if (!document) return null

  await cloudinary.uploader.destroy(document.filename).catch(() => {})
  await repo.dbDeleteDocument(id)
  await logAudit(userId, "DELETE", "DOCUMENT", id)
  return true
}
