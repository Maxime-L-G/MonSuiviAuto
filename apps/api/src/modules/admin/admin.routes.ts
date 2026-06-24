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

/**
 * @openapi
 * /admin/users/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Supprimer un utilisateur et toutes ses données (ADMIN uniquement)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Utilisateur supprimé }
 *       400: { description: Un admin ne peut pas se supprimer lui-même via cette route }
 *       403: { description: Accès refusé — rôle ADMIN requis }
 */
adminRouter.delete("/users/:id", requireAuth, requireAdmin, controller.deleteUser)
