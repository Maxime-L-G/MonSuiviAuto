import { Router } from "express"
import { requireAuth } from "../../middleware/requireAuth"
import * as controller from "./dashboard.controller"

export const dashboardRouter = Router()

/**
 * @openapi
 * /dashboard/summary:
 *   get:
 *     tags: [Dashboard]
 *     summary: Récupérer les données agrégées du dashboard
 *     description: Nombre de véhicules, d'entretiens, dépenses, rappels à venir, dépenses mensuelles et répartition par type d'entretien.
 *     responses:
 *       200: { description: Données du dashboard }
 */
dashboardRouter.get("/dashboard/summary", requireAuth, controller.getSummary)
