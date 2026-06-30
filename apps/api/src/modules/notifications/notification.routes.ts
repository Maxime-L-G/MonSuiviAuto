import { Router } from "express"
import * as controller from "./notification.controller"

export const notificationRouter = Router()

/**
 * @openapi
 * /cron/check-reminders:
 *   post:
 *     tags: [Notifications]
 *     summary: Envoie un email pour chaque rappel arrivant à échéance dans les 3 jours (déclenché par un cron externe)
 *     security: []
 *     parameters:
 *       - in: header
 *         name: X-Cron-Secret
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: "Nombre de rappels vérifiés et d'emails envoyés" }
 *       401: { description: "Secret invalide" }
 */
notificationRouter.post("/cron/check-reminders", controller.checkReminders)
