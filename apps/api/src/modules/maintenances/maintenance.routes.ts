import { Router } from "express"
import { requireAuth } from "../../middleware/requireAuth"
import * as controller from "./maintenance.controller"

export const maintenanceRouter = Router()

/**
 * @openapi
 * /vehicles/{vehicleId}/maintenances:
 *   get:
 *     tags: [Entretiens]
 *     summary: Lister les entretiens d'un véhicule
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Liste des entretiens }
 */
maintenanceRouter.get("/vehicles/:vehicleId/maintenances", requireAuth, controller.list)

/**
 * @openapi
 * /vehicles/{vehicleId}/maintenances:
 *   post:
 *     tags: [Entretiens]
 *     summary: Créer un entretien (génère un rappel automatique selon le type)
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, date, mileage]
 *             properties:
 *               type: { type: string, enum: [OIL_CHANGE, TIRES, BRAKES, BATTERY, INSPECTION, REPAIR, OTHER] }
 *               title: { type: string }
 *               date: { type: string, format: date }
 *               mileage: { type: integer }
 *               costCents: { type: integer }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Entretien créé }
 */
maintenanceRouter.post("/vehicles/:vehicleId/maintenances", requireAuth, controller.create)

/**
 * @openapi
 * /maintenances/{id}:
 *   patch:
 *     tags: [Entretiens]
 *     summary: Modifier un entretien
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Entretien modifié }
 */
maintenanceRouter.patch("/maintenances/:id", requireAuth, controller.update)

/**
 * @openapi
 * /maintenances/{id}:
 *   delete:
 *     tags: [Entretiens]
 *     summary: Supprimer un entretien
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Entretien supprimé }
 */
maintenanceRouter.delete("/maintenances/:id", requireAuth, controller.remove)
