import { Router } from "express"
import { requireAuth } from "../../middleware/requireAuth"
import { requireAdmin } from "../../middleware/requireAdmin"
import * as controller from "./admin.controller"

export const adminRouter = Router()

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Lister tous les utilisateurs (ADMIN uniquement)
 *     responses:
 *       200: { description: Liste des utilisateurs avec leur nombre de véhicules }
 *       403: { description: Accès refusé — rôle ADMIN requis }
 */
adminRouter.get("/users", requireAuth, requireAdmin, controller.listUsers)
