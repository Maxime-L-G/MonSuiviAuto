import { Router } from "express"
import { requireAuth } from "../../middleware/requireAuth"
import * as controller from "./auth.controller"

export const authRouter = Router()

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Créer un compte
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: alice@test.com }
 *               password: { type: string, example: password123 }
 *               role: { type: string, enum: [USER, PROFESSIONAL] }
 *     responses:
 *       201: { description: Compte créé }
 *       400: { description: Erreur de validation }
 *       409: { description: Email déjà utilisé }
 */
authRouter.post("/register", controller.register)

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Se connecter
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Connexion réussie, retourne un token JWT et le profil }
 *       401: { description: Identifiants invalides }
 */
authRouter.post("/login", controller.login)

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     responses:
 *       200: { description: Profil utilisateur }
 *       401: { description: Non authentifié }
 */
authRouter.get("/me", requireAuth, controller.getMe)

/**
 * @openapi
 * /auth/me/export:
 *   get:
 *     tags: [Auth]
 *     summary: Exporter toutes mes données (RGPD)
 *     responses:
 *       200: { description: Fichier JSON contenant toutes les données de l'utilisateur }
 */
authRouter.get("/me/export", requireAuth, controller.exportData)

/**
 * @openapi
 * /auth/me:
 *   delete:
 *     tags: [Auth]
 *     summary: Supprimer mon compte et toutes mes données (RGPD)
 *     responses:
 *       204: { description: Compte supprimé }
 */
authRouter.delete("/me", requireAuth, controller.deleteAccount)
