import { Request, Response } from "express"
import * as service from "./document.service"

export async function list(req: Request, res: Response) {
  const userId = req.user!.id
  const { vehicleId } = req.params

  const documents = await service.listDocuments(userId, vehicleId)
  if (!documents) return res.status(404).json({ error: "VEHICLE_NOT_FOUND" })

  return res.json({ documents })
}

export async function create(req: Request, res: Response) {
  const userId = req.user!.id
  const { vehicleId } = req.params

  if (!req.file) {
    return res.status(400).json({ error: "FILE_REQUIRED" })
  }

  const document = await service.createDocument(userId, vehicleId, req.file as never)
  if (!document) return res.status(404).json({ error: "VEHICLE_NOT_FOUND" })

  return res.status(201).json({ document })
}

export async function download(req: Request, res: Response) {
  const userId = req.user!.id
  const { id } = req.params

  const document = await service.getDocumentForDownload(userId, id)
  if (!document) return res.status(404).json({ error: "DOCUMENT_NOT_FOUND" })

  return res.redirect(document.url)
}

export async function remove(req: Request, res: Response) {
  const userId = req.user!.id
  const { id } = req.params

  const ok = await service.deleteDocument(userId, id)
  if (!ok) return res.status(404).json({ error: "DOCUMENT_NOT_FOUND" })

  return res.status(204).send()
}
