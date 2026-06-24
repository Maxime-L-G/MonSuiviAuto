import { Router } from "express"
import * as controller from "./vehicle.controller"
import { requireAuth } from "../../middleware/requireAuth"

export const vehicleRouter = Router()

/**
 * @openapi
 * /vehicles:
 *   post:
 *     tags: [Véhicules]
 *     summary: Créer un véhicule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [make, model, year, currentKm]
 *             properties:
 *               make: { type: string, example: Peugeot }
 *               model: { type: string, example: 208 }
 *               year: { type: integer, example: 2020 }
 *               currentKm: { type: integer, example: 30000 }
 *               usage: { type: string, enum: [PERSONAL, PROFESSIONAL] }
 *     responses:
 *       201: { description: Véhicule créé }
 */
vehicleRouter.post("/", requireAuth, controller.create)

/**
 * @openapi
 * /vehicles:
 *   get:
 *     tags: [Véhicules]
 *     summary: Lister mes véhicules actifs
 *     responses:
 *       200: { description: Liste des véhicules non archivés }
 */
vehicleRouter.get("/", requireAuth, controller.list)

/**
 * @openapi
 * /vehicles/archived:
 *   get:
 *     tags: [Véhicules]
 *     summary: Lister mes véhicules archivés
 *     responses:
 *       200: { description: Liste des véhicules archivés }
 */
vehicleRouter.get("/archived", requireAuth, controller.listArchived)

/**
 * @openapi
 * /vehicles/{id}:
 *   get:
 *     tags: [Véhicules]
 *     summary: Récupérer le détail d'un véhicule
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Détail du véhicule }
 *       404: { description: Véhicule introuvable }
 */
vehicleRouter.get("/:id", requireAuth, controller.getOne)

/**
 * @openapi
 * /vehicles/{id}:
 *   patch:
 *     tags: [Véhicules]
 *     summary: Modifier un véhicule
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Véhicule modifié }
 *       404: { description: Véhicule introuvable }
 */
vehicleRouter.patch("/:id", requireAuth, controller.update)

/**
 * @openapi
 * /vehicles/{id}/archive:
 *   patch:
 *     tags: [Véhicules]
 *     summary: Archiver un véhicule (soft delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Véhicule archivé }
 *       404: { description: Véhicule introuvable }
 */
vehicleRouter.patch("/:id/archive", requireAuth, controller.archive)

/**
 * @openapi
 * /vehicles/{id}:
 *   delete:
 *     tags: [Véhicules]
 *     summary: Supprimer définitivement un véhicule
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Véhicule supprimé }
 *       404: { description: Véhicule introuvable }
 */
vehicleRouter.delete("/:id", requireAuth, controller.remove)
