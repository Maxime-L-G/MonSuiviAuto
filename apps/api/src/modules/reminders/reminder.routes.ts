import { Router } from "express"
import { requireAuth } from "../../middleware/requireAuth"
import * as controller from "./reminder.controller"

export const reminderRouter = Router()

/**
 * @openapi
 * /vehicles/{vehicleId}/reminders:
 *   get:
 *     tags: [Rappels]
 *     summary: Lister les rappels d'un véhicule
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Liste des rappels }
 */
reminderRouter.get("/vehicles/:vehicleId/reminders", requireAuth, controller.listForVehicle)

/**
 * @openapi
 * /vehicles/{vehicleId}/reminders:
 *   post:
 *     tags: [Rappels]
 *     summary: Créer un rappel
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
 *             required: [title]
 *             properties:
 *               type: { type: string, enum: [INSPECTION, INSURANCE, OIL_CHANGE, CUSTOM] }
 *               title: { type: string }
 *               dueDate: { type: string, format: date }
 *               dueMileage: { type: integer }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Rappel créé }
 */
reminderRouter.post("/vehicles/:vehicleId/reminders", requireAuth, controller.createForVehicle)

/**
 * @openapi
 * /reminders/{id}:
 *   patch:
 *     tags: [Rappels]
 *     summary: Modifier un rappel (ex. marquer comme terminé)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Rappel modifié }
 */
reminderRouter.patch("/reminders/:id", requireAuth, controller.updateOne)

/**
 * @openapi
 * /reminders/{id}:
 *   delete:
 *     tags: [Rappels]
 *     summary: Supprimer un rappel
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Rappel supprimé }
 */
reminderRouter.delete("/reminders/:id", requireAuth, controller.remove)

/**
 * @openapi
 * /reminders/upcoming:
 *   get:
 *     tags: [Rappels]
 *     summary: Lister les rappels à venir dans les 30 prochains jours (tous véhicules confondus)
 *     responses:
 *       200: { description: Liste des rappels à venir }
 */
reminderRouter.get("/reminders/upcoming", requireAuth, controller.upcoming)
