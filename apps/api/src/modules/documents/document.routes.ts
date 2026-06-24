import { Router } from "express"
import { requireAuth } from "../../middleware/requireAuth"
import { upload } from "../../config/upload"
import * as controller from "./document.controller"

export const documentRouter = Router()

/**
 * @openapi
 * /vehicles/{vehicleId}/documents:
 *   get:
 *     tags: [Documents]
 *     summary: Lister les documents d'un véhicule
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Liste des documents }
 */
documentRouter.get("/vehicles/:vehicleId/documents", requireAuth, controller.list)

/**
 * @openapi
 * /vehicles/{vehicleId}/documents:
 *   post:
 *     tags: [Documents]
 *     summary: Uploader un document (PDF, JPG, PNG, WEBP — 10 Mo max)
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file: { type: string, format: binary }
 *     responses:
 *       201: { description: Document enregistré }
 *       400: { description: Fichier manquant ou type non supporté }
 */
documentRouter.post(
  "/vehicles/:vehicleId/documents",
  requireAuth,
  upload.single("file"),
  controller.create
)

/**
 * @openapi
 * /documents/{id}/download:
 *   get:
 *     tags: [Documents]
 *     summary: Télécharger un document
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Fichier binaire }
 *       404: { description: Document introuvable }
 */
documentRouter.get("/documents/:id/download", requireAuth, controller.download)

/**
 * @openapi
 * /documents/{id}:
 *   delete:
 *     tags: [Documents]
 *     summary: Supprimer un document
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Document supprimé }
 */
documentRouter.delete("/documents/:id", requireAuth, controller.remove)
