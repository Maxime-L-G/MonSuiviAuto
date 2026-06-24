import * as repo from "./document.repository"
import { cloudinary } from "../../config/cloudinary"
import { logAudit } from "../audit/audit.service"

export async function listDocuments(userId: string, vehicleId: string) {
  const vehicle = await repo.dbFindVehicleOwned(vehicleId, userId)
  if (!vehicle) return null

  return repo.dbListDocuments(vehicleId)
}

function uploadToCloudinary(buffer: Buffer): Promise<{ publicId: string; url: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "monsuiviauto", resource_type: "auto" },
      (error, result) => {
        if (error || !result) return reject(error)
        resolve({ publicId: result.public_id, url: result.secure_url })
      }
    )
    stream.end(buffer)
  })
}

export async function createDocument(
  userId: string,
  vehicleId: string,
  file: { buffer: Buffer; originalname: string; mimetype: string; size: number }
) {
  const vehicle = await repo.dbFindVehicleOwned(vehicleId, userId)
  if (!vehicle) return null

  const uploaded = await uploadToCloudinary(file.buffer)

  const document = await repo.dbCreateDocument(vehicleId, {
    filename: uploaded.publicId,
    url: uploaded.url,
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
