import { Router } from "express"
import { requireAuth } from "../../middleware/requireAuth"
import * as controller from "./garages.controller"

export const garagesRouter = Router()

/**
 * @openapi
 * /garages:
 *   get:
 *     tags: [Garages]
 *     summary: Lister les garages à proximité d'une position (proxy serveur vers Overpass API)
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: lon
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200: { description: Liste des garages dans un rayon de 5 km }
 *       400: { description: Coordonnées invalides }
 *       503: { description: Service Overpass indisponible }
 */
garagesRouter.get("/garages", requireAuth, controller.list)
